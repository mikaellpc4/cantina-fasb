const mysql = require('mysql'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createPool({
    connectionLimit : 10,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

exports.register = (req, res) => {
    console.log(req.body);
    
    // const name = req.body.name;
    // const email = req.body.email;
    // const telefone = req.body.telefone;
    // const password = req.body.password;
    // const passwordConfirm = req.body.passwordConfirm;

    const { name, lastname, email, telefone, password, passwordConfirm } = req.body;
    const fullname = name + ' ' + lastname

    db.getConnection( (error, connection) => {
        if(error) {
            console.log(error);
            return res.status(500).render('index',{
                message: 'Falha na conexão com o banco de dados'
            })
        }else if ( name && lastname && email && telefone && password && passwordConfirm ){
            db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) =>{
                if(error){
                    console.log(error);
                }
                // results é recebido em forma de array
                if( results.length > 0 ){
                    console.log('email ja utilizado')
                    return res.status(400).render('index',{
                        message: 'Este email ja esta sendo utilizado'
                    })
                } else if( password !== passwordConfirm ){
                    console.log('senhas não conferem')
                    return res.status(400).render('index',{
                        message: 'As senhas não conferem'
                    });
                }

                let hashedPassword = await bcrypt.hash(password, 8);
                console.log(hashedPassword);
                
                db.query('INSERT INTO users SET ?', {name: fullname, email: email, telefone: telefone,password: hashedPassword}, (error, results) =>{
                    if(error){
                        console.log(error);
                    } else {
                        console.log('Usuario Registrado')
                        return res.status(200).render('index',{
                            message: 'Usuario Registrado'
                        });
                    }
                });
            })
        }else{
            return res.status(422).render('index',{
                message: 'Preencha todos os campos'
            });
        }
        connection.release();
    }); 
}

exports.login = (req, res) => {
    res.status(200).json({ msg:'Login' })
}
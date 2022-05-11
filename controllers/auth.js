const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const flash = require('express-flash')

const db = mysql.createPool({
    connectionLimit: 10,
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

    const { name, lastname, email, celular, password, passwordConfirm } = req.body;
    const fullname = name + ' ' + lastname

    db.getConnection((error, connection) => {
        if (error) {
            console.log(error);
            req.flash('Status', 'Falha no banco de dados');
            return res.status(500).render("pages/index",{page:'login'})
        } else if (name && lastname && email && celular && password && passwordConfirm) {
            db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
                if (error) {
                    console.log(error);
                }
                //results é recebido em forma de array
                if (results.length > 0) {
                    console.log('email ja utilizado')
                    req.flash('Status', 'Email ja em uso');
                    return res.status(422).render("pages/index",{page:'register'})
                } else if (password !== passwordConfirm) {
                    console.log('senhas não conferem')
                    req.flash('Status', 'Senhas não conferem');
                    return res.status(422).render("pages/index",{page:'register'})
                }

                let hashedPassword = await bcrypt.hash(password, 12);
                console.log(hashedPassword);

                db.query('INSERT INTO users SET ?', { name: fullname, email: email, celular: celular, password: hashedPassword }, (error, results) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Usuario Registrado')
                        req.flash('Status', 'Registrado com sucesso');
                        return res.status(200).render("pages/index", { page: 'login' });
                    }
                });
            })
        } else {
            req.flash('Status', 'Faltam dados');
            return res.status(422)
        }
        connection.release();
    });
}

exports.login = (req, res) => {
    res.status(200).json({ msg: 'Login' })
}
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

exports.register = async (req, res) => {
    console.log(req.body);

    // const name = req.body.name;
    // const email = req.body.email;
    // const telefone = req.body.telefone;
    // const password = req.body.password;
    // const passwordConfirm = req.body.passwordConfirm;

    const { firstName, lastName, email, celular, password, passwordConfirm } = req.body;
    const fullname = firstName + ' ' + lastName


    db.getConnection(async (error, connection) => {

        //Verifica conexão com o banco de dados
        if (error) {
            console.log(error);
            req.flash('Status', 'Ocorreu um erro do nosso lado, tente novamente');
            return res.status(500).render("pages/index", { page: 'register' })
        }

        //Validação de dados
        if (!firstName) {
            req.flash('Status', 'O nome é obrigatório');
            return res.status(422).render("pages/index", { page: 'register' })
        }

        if (firstName < 3) {
            req.flash('Status', 'O nome deve possuir no minimo 3 caracters');
            return res.status(422).render("pages/index", { page: 'register' })
        }


        if (!lastName) {
            req.flash('Status', 'O sobrenome é obrigatório');
            return res.status(422).render("pages/index", { page: 'register' })
        }

        if (lastName < 3) {
            req.flash('Status', 'O sobrenome precisa ter no minimo 3 caracters');
            return res.status(422).render("pages/index", { page: 'register' })
        }

        if (!email) {
            req.flash('Status', 'O email é obrigatório');
            return res.status(422).render("pages/index", { page: 'register' })
        }

        validarEmail = (emailAdress) => {
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailAdress)
        }

        if (validarEmail(email) == false) {
            req.flash('Status', 'O email não é valido');
            return res.status(422).render("pages/index", { page: 'register' })
        }


        if (!celular) {
            req.flash('Status', 'O numero de celular é obrigatório');
            return res.status(422).render("pages/index", { page: 'register' })
        }

        validarCelular = (numeroCell) => {
            return /^[0-9]{10,11}$/.test(numeroCell)
        }

        if (validarCelular(celular) == false) {
            req.flash('Status', 'O numero de celular não é valido');
            return res.status(422).render("pages/index", { page: 'register' })
        }


        if (password !== passwordConfirm) {
            req.flash('Status', 'As senhas não conferem');
            return res.status(422).render("pages/index", { page: 'register' })
        }

        let hashedPassword = await bcrypt.hash(password, 12);


        db.query(`SELECT email FROM users WHERE email='${email}'`, async (error, results) => {
            if (error) {
                console.log(error);
            }
            if (results.length > 0) {
                req.flash('Status', 'Este email ja esta cadastrado');
                return res.status(422).render("pages/index", { page: 'register' })
            }

            db.query(`SELECT celular FROM users WHERE celular='${celular}'`, async (error, results) => {
                if (error) {
                    console.log(error);
                }
                if (results.length > 0) {
                    req.flash('Status', 'Este numero de celular ja esta cadastrado');
                    return res.status(422).render("pages/index", { page: 'register' })
                }

                db.query('INSERT INTO users SET ?', { name: fullname, email: email, celular: celular, password: hashedPassword }, async (error) => {
                    if (error) {
                        console.log(error)
                    }
                    req.flash('Status', 'Registrado com sucesso');
                    return res.status(200).render("pages/index", { page: 'login' });
                });
            })
        })

        connection.release();
    })
}

exports.login = async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;

    //Validação dos dados

    if (!email) {
        req.flash('Status', 'O email é obrigatório');
        return res.status(422).render("pages/index", { page: 'login' })
    }

    validarEmail = (emailAdress) => {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailAdress)
    }

    if (validarEmail(email) == false) {
        req.flash('Status', 'O email não é valido');
        return res.status(422).render("pages/index", { page: 'login' })
    }

    db.query(`SELECT * FROM users WHERE email='${email}'`, async (error, results) => {
        if (error) {
            console.log(error);
        }
        if (results.length == 0) {
            req.flash('Status', 'Seu email esta incorreto');
            return res.status(422).render("pages/index", { page: 'login' })
        }

        const dbPassword = results[0].password
        const userID = results[0].id

        const checkPassword = await bcrypt.compare(password, dbPassword)

        if (!checkPassword) {
            req.flash('Status', 'Sua senha esta incorreta');
            return res.status(422).render("pages/index", { page: 'login' })
        }

        const secret = process.env.SECRET
        const token = jwt.sign(
            {
                id: userID,
            },
            secret,
        )

        return res.status(200).json({msg: `Você foi autenticado com o token: ${token}`})
    })

}
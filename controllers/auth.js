const db = require('../routes/database')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const cellExist = async (cellNum) => {
    results = await db.query(`SELECT celular FROM users WHERE celular='${cellNum}'`)
    if (results.rows.length > 0) {
        return true
    }
    return false
}

const emailExist = async (emailAdress) => {
    results = await db.query(`SELECT email FROM users WHERE email='${emailAdress}'`)
    if (results.rows.length > 0) {
        return true
    }
    return false
}


exports.register = async (req, res) => {
    // const name = req.body.name;
    // const email = req.body.email;
    // const telefone = req.body.telefone;
    // const password = req.body.password;
    // const passwordConfirm = req.body.passwordConfirm;

    const { firstName, lastName, email, celular, password, passwordConfirm } = req.body;
    const fullname = firstName + ' ' + lastName

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

    if (await emailExist(email) == true) {
        req.flash('Status', 'Este email ja foi registrado');
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

    if (await cellExist(celular) == true) {
        req.flash('Status', 'O numero de celular ja esta sendo usado');
        return res.status(422).render("pages/index", { page: 'register' })
    }

    if (password != passwordConfirm) {
        req.flash('Status', 'As senhas não conferem');
        return res.status(422).render("pages/index", { page: 'register' })
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    db.query(`INSERT INTO users (role,name,email,celular,password) VALUES ('user','${fullname}','${email}','${celular}','${hashedPassword}')`)
    req.flash('Status', 'Registrado com sucesso');
    return res.status(200).render("pages/index", { page: 'login' });
}


exports.login = async (req, res) => {
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

    try {
        const results = await db.query(`SELECT * FROM users WHERE email='${email}'`)
        if (results.length == 0) {
            req.flash('Status', 'Seu email esta incorreto');
            return res.status(422).render("pages/index", { page: 'login' })
        }
        const dbPassword = results.rows[0].password
        const userID = results.rows[0].id

        const checkPassword = await bcrypt.compare(password, dbPassword)

        if (!checkPassword) {
            req.flash('Status', 'Sua senha esta incorreta');
            return res.status(422).render("pages/index", { page: 'login' })
        }

        const secret = process.env.SECRET
        const token = jwt.sign( { id: userID } ,secret, {expiresIn: "1h"})
        res.cookie("token", token, {
            httpOnly: true,
            // secure: true,
            // maxAge: 1000000,
            // signed: true
        })
        return res.status(200).redirect("/shop")
    }
    catch (err) {
        console.log(err)
    }
}
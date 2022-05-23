const db = require('../routes/database')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const ApiError = require('../controllers/errorController')
const { creatAcessToken, creatRefreshToken} = require('../src/token')

const cellExist = async (cellNum) => {
    results = await db.query(`SELECT celular FROM users WHERE celular='${cellNum}'`)
    if (results.rows.length > 0) {
        return true
    }
    return false
}

const emailExist = async (emailAdress) => {
    results = await db.query(`SELECT email FROM users WHERE email ILIKE '${emailAdress}'`)
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
        ApiError.badRequest(req, 'O nome é obrigatorio')
        return res.render("pages/index", { page: 'register' })
    }

    if (firstName < 3) {
        ApiError.badRequest(req, 'O nome deve possuir no minimo 3 caracters')
        return res.render("pages/index", { page: 'register' })
    }


    if (!lastName) {
        ApiError.badRequest(req, 'O sobrenome é obrigatorio')
        return res.render("pages/index", { page: 'register' })
    }

    if (lastName < 3) {
        ApiError.badRequest(req, 'O sobrenome precisa ter no minimo 3 caracters')
        return res.render("pages/index", { page: 'register' })
    }

    if (!email) {
        ApiError.badRequest(req, 'O email é obrigatório')
        return res.render("pages/index", { page: 'register' })
    }

    validarEmail = (emailAdress) => {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailAdress)
    }

    if (validarEmail(email) == false) {
        ApiError.badRequest(req, 'O email não é valido')
        return res.render("pages/index", { page: 'register' })
    }

    if (await emailExist(email) == true) {
        ApiError.badRequest(req, 'Este email ja foi registrado');
        return res.render("pages/index", { page: 'register' });
    }

    if (!celular) {
        ApiError.badRequest(req, 'O numero de celular é obrigatório');
        return res.render("pages/index", { page: 'register' });
    }

    validarCelular = (numeroCell) => {
        return /^[0-9]{10,11}$/.test(numeroCell)
    }

    if (validarCelular(celular) == false) {
        ApiError.badRequest(req, 'O numero de celular não é valido');
        return res.render("pages/index", { page: 'register' })
    }

    if (await cellExist(celular) == true) {
        ApiError.badRequest(req, 'O numero de celular ja esta sendo usado');
        return res.render("pages/index", { page: 'register' })
    }

    if (password != passwordConfirm) {
        ApiError.badRequest(req, 'As senhas não conferem');
        return res.status(422).render("pages/index", { page: 'register' })
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    db.query(`INSERT INTO users (role,name,email,celular,password) VALUES ('user','${fullname}','${email}','${celular}','${hashedPassword}')`)
    req.flash('Status', 'Registrado com sucesso');
    return res.status(200).render("pages/index", { page: 'login' });

}


exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email) {
        ApiError.badRequest(req, 'Falta o email')
        return res.render("pages/index", { page: 'login' })
    }

    validarEmail = (emailAdress) => {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailAdress)
    }

    if (validarEmail(email) == false) {
        ApiError.badRequest(req, 'O email não é valido')
        return res.render("pages/index", { page: 'login' })
    }
    const results = await db.query(`SELECT * FROM users WHERE email ILIKE '${email}'`)
    if (results.rows.length == 0) {
        ApiError.badRequest(req, 'Seu email ou senha estão incorretos')
        return res.render("pages/index", { page: 'login' })
    }
    const dbPassword = results.rows[0].password
    const userID = results.rows[0].id
    const userRole = results.rows[0].role

    const checkPassword = await bcrypt.compare(password, dbPassword)

    if (!checkPassword) {
        ApiError.badRequest(req, 'Sua enha esta incorreta')
        return res.render("pages/index", { page: 'login' })
    }

    const acessToken = creatAcessToken(userID, userRole)
    const refreshToken = await creatRefreshToken(userID, userRole)


    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        // maxAge: 1000000,
        // signed: true
    })
    res.cookie("acessToken", acessToken, {
        httpOnly: true,
        secure: true,
        // maxAge: 1000000,
        // signed: true
    })
    

    return res.status(200).redirect('/shop')
}   
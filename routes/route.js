const express = require('express');
const route = express.Router();
const { cookieJwTAuth } = require("../middleware/cookieJwTAuth")
const db = require('../routes/database')
const authController = require('../controllers/auth')
const {deleteRefreshToken} = require('../src/token')


const use = fn => (req,res,next) =>
    Promise.resolve(fn(req, res, next)).catch(next)

// Public Route
route.get('/', (req, res) => {
    const refreshToken = req.cookies.refreshToken
    if(refreshToken){
        return res.status(200).redirect("/shop")
    }
    res.render("pages/index", { page: 'register' });
})

route.get('/login', (req, res) => {
    const refreshToken = req.cookies.refreshToken
    if(refreshToken){
        return res.status(200).redirect("/shop")
    }
    res.render("pages/index", { page: 'login' });
})

route.get('/user/logout', async (req, res) => {
    const refreshToken = req.cookies.refreshToken
    deleteRefreshToken(refreshToken)
    req.flash('Status', 'Você se deslogou');
    res.status(200).clearCookie("refreshToken").redirect("/login");
})

route.get('/user/:id', use(cookieJwTAuth), async (req, res) => {
    // throw Error('Mikael')
    const id = req.params.id
    const getUser = async () => {
        const user = await db.query(`SELECT id,role,name,email,celular,validated FROM users WHERE id='${id}'`)
        return user.rows[0]
    }
    const data = await getUser()
    if(data && data.id == id){
        return res.status(200).json({msg: "user found"})
    }
    return res.status(404).json({msg: "user not found"})
})

route.get('/shop', use(cookieJwTAuth), (req, res) => res.render("pages/shop", {page: 'produtos'}))
route.get('/shop/pedidos', use(cookieJwTAuth), (req, res) => res.render("pages/shop", {page: 'pedidos'}))
route.get('/shop/pedidos/historico_de_pedidos', use(cookieJwTAuth), (req, res) => res.render("pages/shop", {page: 'historico de pedidos'}))

route.post('/register', use(authController.register))
route.post('/login', use(authController.login ))

module.exports = route
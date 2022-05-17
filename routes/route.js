const express = require('express');
const route = express.Router();
const { cookieJwTAuth } = require("../middleware/cookieJwTAuth")
const db = require('../routes/database')



// Public Route
route.get('/', (req, res) => {
    const token = req.cookies.token
    if(token){
        return res.status(200).redirect("/shop")
    }
    res.render("pages/index", { page: 'register' });
})

route.get('/login', (req, res) => {
    const token = req.cookies.token
    if(token){
        return res.status(200).redirect("/shop")
    }
    res.render("pages/index", { page: 'login' });
})

route.get('/user/logout', async (req, res) => {
    req.flash('Status', 'Você se deslogou');
    res.status(200).clearCookie("token").redirect("/login");
})

route.get('/user/:id', cookieJwTAuth, async (req, res) => {

    const id = req.params.id
    const getUser = async () => {
        try {
            const user = await db.query(`SELECT id,role,name,email,celular,validated FROM users WHERE id='${id}'`)
            return user.rows[0]
        }
        catch (err) {
            console.log(err);
        }
    }
    const data = await getUser()
    if(data && data.id == id){
        return res.status(200).json({msg: "user found"})
    }
    return res.status(404).json({msg: "user not found"})
    // if(user = 0){
    //     console.log
    // }
})

route.get('/shop', cookieJwTAuth, (req, res) => res.render("pages/shop", {page: 'produtos'}))
route.get('/shop/pedidos', cookieJwTAuth, (req, res) => res.render("pages/shop", {page: 'pedidos'}))
route.get('/shop/pedidos/historico_de_pedidos', cookieJwTAuth, (req, res) => res.render("pages/shop", {page: 'historico de pedidos'}))

module.exports = route
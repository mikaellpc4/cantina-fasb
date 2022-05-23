const jwt = require('jsonwebtoken');
const ApiError = require('../controllers/errorController')
const db = require('../routes/database')
const {creatAcessToken,validateToken,deleteRefreshToken} = require('../src/token')

exports.cookieJwTAuth = async (req, res, next) => {

    const acessToken = req.cookies['acessToken']
    const refreshToken = req.cookies['refreshToken']
    const validAcess = await validateToken(acessToken, 'acess')
    const validRefreshToken = await validateToken(refreshToken, 'refresh')

    if (!validAcess) {
        if (!validRefreshToken) {
            ApiError.badRequest(req, 'Você deve se logar primeiro')
            res.clearCookie("refreshToken");
            res.clearCookie("acessToken");
            return res.redirect("/login")
        }
        if(validRefreshToken  == 'TokenExpiredError'){
            ApiError.badRequest(req, 'Sua sessão expirou')
            deleteRefreshToken(refreshToken)
            res.clearCookie("refreshToken");
            res.clearCookie("acessToken");
            return res.redirect('/login')
        }
        if(validRefreshToken  == 'revokedToken'){
            ApiError.badRequest(req, 'Sua sessão foi finalizada')
            res.clearCookie("refreshToken");
            res.clearCookie("acessToken");
            return res.redirect('/login')
        }
        const userID = jwt.decode(refreshToken)
        const userRole = jwt.decode(refreshToken)
        const acessToken = creatAcessToken(userID,userRole)
        res.cookie("acessToken", acessToken, {
            httpOnly: true,
            // secure: true,
            // maxAge: 1000000,
            // signed: true
        }) 
        const isValid = await validateToken(acessToken, 'acess')
        if (isValid) {
            next()
            return
        }
        res.clearCookie("acessToken");
        res.clearCookie("refreshToken");
        ApiError.badRequest(req, 'Você deve se logar primeiro')
        return res.redirect("/login")
    }
    next()
}

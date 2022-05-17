const jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');

exports.cookieJwTAuth = (req, res, next) => {
    const token = req.cookies.token
    try{
        const user = jwt.verify(token, process.env.SECRET)
        next()
    }
    catch(err){
        res.clearCookie("token");
        return res.status(401).json({msg: "Falha na autenticação"})
    }
}
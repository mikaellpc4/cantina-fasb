const { JsonWebTokenError } = require('jsonwebtoken')
const db = require('../routes/database')
const jwt = require('jsonwebtoken')

const acessSecret = process.env.ACESS_SECRET
const refreshSecret = process.env.REFRESH_SECRET

const creatAcessToken = (id,role) =>{
    const acessToken = jwt.sign({id: id, role: role}, acessSecret, { expiresIn: "10m" })
    return acessToken
}

const creatRefreshToken = async(id,role,tokenNum) =>{
    const refreshToken = jwt.sign({id: id, role: role, num: tokenNum}, refreshSecret, { expiresIn: "7d" })
    await db.query(`UPDATE users SET refreshtokens= refreshtokens || '{${refreshToken}}' WHERE id=${id}`)
    return refreshToken
}

const deleteRefreshToken = async(token) =>{
    const user = jwt.decode(token, refreshSecret)
    await db.query(`UPDATE users SET refreshtokens= array_remove(refreshtokens,'${token}') WHERE id=${user.id}`)
}

const validateToken = async (token, type) => {
    try {
        if (type == 'acess') {
            const isValid = jwt.verify(token, acessSecret)
            return true
        }
        if (type == 'refresh') {
            const exist = await db.query(`SELECT refreshtokens FROM users WHERE refreshtokens @>'{${token}}'`)
            const isValid = jwt.verify(token, refreshSecret)
            if(exist.rows.length > 0){
                return true
            }
            throw {name : "revokedToken"}; 
        }
        await db.query(`SELECT `)
    }
    catch (err) {
        if(type == 'refresh') {
            if(err.name == 'TokenExpiredError'){
                return err.name
            }
            if(err.name == 'revokedToken'){
                return err.name
            }
        }
        return false
    }   
}

module.exports = {creatAcessToken,creatRefreshToken,deleteRefreshToken,validateToken}
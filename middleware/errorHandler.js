const ApiError = require('../controllers/errorController')

const errorHandler = (err,req,res,next) => {
    console.log(err);

    if(err instanceof ApiError){
        res.status(err.code).json(err.me);
        return;
    }
    res.status(500).json('Ocorreu algum problema do nosso lado')
}   

module.exports = errorHandler
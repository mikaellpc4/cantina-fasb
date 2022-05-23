const req = require("express/lib/request");

class ApiError {
    constructor(code,message) {
        this.code = code;
        this.message = message;
    }

    static badRequest(req,msg){
        req.flash('Status',msg)
        return new ApiError(400,msg)
    }

    static internalError(msg){
        return new ApiError(500,msg)
    }
}   

module.exports = ApiError;
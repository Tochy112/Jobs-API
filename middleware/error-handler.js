const CustomError = require("../errors/custom-error")
const {StatusCodes} = require("http-status-codes")

const ErrorHandlerMiddleware = (err, req, res, next) => {

    // if (err instanceof CustomError) {
    //     return res.status(err.statusCode).json({msg: err.message})
    // }

   let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg:  err.message || "Something went wrong, try again later"
    }

    // checking duplicate errors in the system
    // the error code is part of the error msg gotten back from mongoose
    if(err.code && err.code === 11000){
        customError.msg = `Duplicate entry for the ${Object.keys(err.keyValue)} field`,
        customError.statusCode = StatusCodes.BAD_REQUEST
    }

    // checking for validation errors
    // the error name is part of the error msg gotten back from mongoose
    if(err.name === "ValidationError"){
        customError.msg = Object.values(err.errors).map((item) => item.message).join(", "),
        customError.statusCode = StatusCodes.BAD_REQUEST
    }

    //checking for cast errors
    if(err.name === "CastError"){
        customError.msg =  ` Item with Id ${err.value} not found`,
        customError.statusCode = StatusCodes.BAD_REQUEST
    }


    // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: err})
    return res.status(customError.statusCode).json({msg: customError.msg})
}

module.exports = ErrorHandlerMiddleware
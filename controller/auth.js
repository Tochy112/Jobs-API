const UserModel = require("../models/user")
const { StatusCodes } = require("http-status-codes")
const { BadRequestError, UnAuthenticatedError } = require("../errors/index")

const register = async(req, res) => {
    const user = await UserModel.create({
        ...req.body
    })

    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({token: token, status: "success"})  
}

const login = async(req, res) => {
    const { email, password } = req.body
    
    if (!email || !password) {
        throw new BadRequestError("Please provide email and password")
    }

    //find user
    const user = await UserModel.findOne({ email })
    if(!user){
        throw new UnAuthenticatedError("Invalid Credentials")
    }

    //compare password
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnAuthenticatedError("Invalid Credentials")
    }

    // console.log(req.headers);
    //create token if user exists and password matches
    const token = user.createJWT() 

    res.status(StatusCodes.OK).json({token: token, msg: "Logged in successfully"})
}


module.exports = {
    register,
    login
}
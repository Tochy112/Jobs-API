const UserModel = require("../models/user")
const jwt = require("jsonwebtoken")
const { UnAuthenticatedError } = require("../errors/index")


const AuthMiddleware = async (req, res, next) => {
    //check for header
    const authHeader = req.headers.authorization
    // console.log(req.headers);

    if (!authHeader || !authHeader.startsWith("Bearer")) {
        throw new UnAuthenticatedError("Aunthentication Invalid")
    }
    //get the token from the headers
    const token = authHeader.split(" ")[1]

    //verify the token
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        //attach the userId and name from the payload (optional)
        req.user = {userId: payload.userId, name: payload.name}
        next()
    } catch (error) {
        throw new UnAuthenticatedError("Aunthentication Invalid")
    }
}

module.exports = AuthMiddleware
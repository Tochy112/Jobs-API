const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


//create a user model and validate
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide name"],
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, "Please provide email"],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please provide a valid email"
        ],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 6
    },
}, 
{timestamps: true}
)

//create an instance of the model and write a function that generates JWT token
UserSchema.methods.createJWT = function(){
    return jwt.sign({userId: this._id, name: this.name}, process.env.JWT_SECRET, { 
        expiresIn:  process.env.JWT_LIFETIME
    })
}

//instance for comparing user passwords for login
UserSchema.methods.comparePassword = async function(password) {
    const isMatch = await bcrypt.compare(password, this.password)
    return isMatch
}

//hash password before creating the model
UserSchema.pre("save", async function(next){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

module.exports = mongoose.model("User", UserSchema)
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

var userSchema = new mongoose.Schema({
    fullName: {
        type: String,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    saltSecret: String,
})

userSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    return emailRegex.test(val)
}, 'Invalid Email Foramat!')

userSchema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password)
}

userSchema.methods.generateJwt = function () {
    return jwt.sign({
        _id: this._id,
        role: this.role
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXP,
    })
} 

mongoose.model('User', userSchema)
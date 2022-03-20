const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
// const { use } = require('../../routes/auth')

const User = mongoose.model('User')

const register = async (req, res, next) => {
    var user = new User()

    var {fullName, username, password, email, role} = req.body

    if(username && password && email && role) {
        if(password.length < 6) {
            res.status(400).json({
                status: error,
                message: 'Password at least 6 characters long'
            })
        } else {
            var salt = await bcrypt.genSalt(10)

            user.username = username
            user.email = email
            user.password = await bcrypt.hash(password, salt)
            user.saltSecret = salt
            user.fullName = fullName
            user.role = role

            user.save((err, doc) => {
                if(err) {
                    if(err.code == 11000){
                        res.status(400).json({
                            status: 'error',
                            message: "Email or Username Already Registered",
                            error: err
                        })
                    } else {
                        return next(err)
                    }
                } else {
                    res.status(201).json({
                        status: 'success',
                        message: 'user created!',
                        data: {
                            _id: doc['_id'],
                            username: username,
                            email: email,
                            role: role,
                            full_name: fullName
                        }
                    })
                }
            })
        }
    } else {
        res.status(400).json({
            status: "error",
            message: "Username, email or password are required!"
        })
    }
}

module.exports = register
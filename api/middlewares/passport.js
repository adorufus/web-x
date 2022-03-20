const passport = require('passport')
const localStrat = require('passport-local').Strategy
const mongoose = require('mongoose')

var User = mongoose.model('User')

passport.use(new localStrat({
    usernameField: 'username'
}, (username, password, done) => {
    User.findOne({username: username}, (err, user) => {
        if(err) return done(err)
        else if(!user) return done(null, false, {status: "error", message: "User is not registered"})
        else if(!user.verifyPassword(password)) return done(null, false, {status: "error", message: "Wrong Password"})
        else return done(null, user)
    })
}))
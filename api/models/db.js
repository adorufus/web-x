const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URL, (err) => {
    if(err) console.log("can't connect to the database, reason: " + err.message)
    else {
        console.log("DB connected")
    }
})

require('./user.model')
require('./banner.model')
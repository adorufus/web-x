require('./config/config')
require('./models/db')
require('./middlewares/passport')

const express = require("express")
const bodyParser = require("body-parser")
const passport = require('passport')
const routers = require('./routes/index')
const app = express()
const PORT = process.env.PORT
const {initializeApp, cert} = require('firebase-admin/app')
const serviceAccount = require('../service.json')

initializeApp({
    credential: cert(serviceAccount),
    storageBucket: "webx-1500b.appspot.com"
})

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(passport.initialize())

app.get('/', (req, res) => {
    res.status(403).json({
        status: "forbidden",
        message: "You're not supposed to be here, please go away"
    })
})

app.use('/api/v1', [routers.authRoute, routers.bannerRoute])

app.listen(PORT, () => {
    console.log("app running in port: " + PORT)
})
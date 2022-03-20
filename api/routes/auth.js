const express = require("express")
const authRoute = express.Router()
const authControllers = require('../controllers/auth/index')
const middlewares = require('../middlewares/index')

authRoute.post('/auth/login', authControllers.loginController)
authRoute.post('/auth/register', authControllers.registerController)
authRoute.get('/user', middlewares.verifyJwt.verifyToken, authControllers.userController.getUser)
authRoute.get('/user/all', middlewares.verifyJwt.verifyToken, authControllers.userController.getAllUser)
authRoute.delete('/user/delete', middlewares.verifyJwt.verifyToken, authControllers.userController.deleteUser)
authRoute.put('/user/update', middlewares.verifyJwt.verifyToken, authControllers.userController.updateUser)

module.exports = authRoute
const express = require('express')
const bannerRoute = express.Router()
const bannerController = require('../controllers/banner/index')
const middlewares = require('../middlewares/index')

bannerRoute.post('/banner/add', [middlewares.verifyJwt.verifyToken, middlewares.filesUpload], bannerController.banner.addBanner)
bannerRoute.get('/banner/all', bannerController.getAllBanner)
bannerRoute.put('/banner/edit', middlewares.verifyJwt.verifyToken, bannerController.editBanner)
bannerRoute.delete('/banner/delete', middlewares.verifyJwt.verifyToken, bannerController.deleteBanner)

module.exports = bannerRoute
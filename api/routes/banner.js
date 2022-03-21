const express = require('express')
const bannerRoute = express.Router()
const bannerController = require('../controllers/banner/index')
const middlewares = require('../middlewares/index')

bannerRoute.post('/banner/add', [middlewares.verifyJwt.verifyToken, middlewares.filesUpload.single("image_file")], bannerController.addBanner)
bannerRoute.get('/banner/all', bannerController.banner.getAllBanner)
bannerRoute.get('/banner', bannerController.banner.getBanner)
bannerRoute.put('/banner/edit', [middlewares.verifyJwt.verifyToken, middlewares.filesUpload.single("image_file")], bannerController.banner.editBanner)
// bannerRoute.delete('/banner/delete', middlewares.verifyJwt.verifyToken, bannerController.deleteBanner)

module.exports = bannerRoute
var express = require('express');
var router = express.Router();
var middlewares = require("../middlewares/index");
var portfolioController = require('../controllers/portfolioController.js');

/*
 * GET
 */
router.get('/portfolio/all', portfolioController.list);

/*
 * GET
 */
router.get('/portfolio/:id', portfolioController.show);

router.get('/portfolio/category/:id', portfolioController.category);

router.get('/portfolio/category/all', portfolioController.allCategory);

router.post('/portfolio/category/create', [middlewares.verifyJwt.verifyToken, middlewares.filesUpload.single("image_file")], portfolioController.createCategory);

// router.put('/portfolio/category/edit/:id', portfolioController.editCategory);

// router.delete('/portfolio/category/delete/:id', portfolioController.deleteCategory);

/*
 * POST
 */
router.post('/portfolio/add', [middlewares.verifyJwt.verifyToken, middlewares.filesUpload.single("image_file")], portfolioController.create);

/*
 * PUT
 */
router.put('/portfolio/edit/:id', [middlewares.verifyJwt.verifyToken, middlewares.filesUpload.single("image_file")], portfolioController.update);

/*
 * DELETE
 */
router.delete('/portfolio/delete/:id', [middlewares.verifyJwt.verifyToken], portfolioController.remove);

module.exports = router;

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
router.get('/portfolio', portfolioController.show);

router.get('/portfolio/category', portfolioController.getCategory);

router.get('/portfolio/category/all', portfolioController.allCategory);

router.post('/portfolio/category/create', [middlewares.verifyJwt.verifyToken, middlewares.filesUpload.single("image_file")], portfolioController.createCategory);

router.put('/portfolio/category/edit', [middlewares.verifyJwt.verifyToken, middlewares.filesUpload.single("image_file")], portfolioController.updateCategory);

router.delete('/portfolio/category/delete', portfolioController.deleteCategory);

/*
 * POST
 */
router.post('/portfolio/create', [middlewares.verifyJwt.verifyToken], portfolioController.create);

/*
 * PUT
 */
router.put('/portfolio/edit/:id', [middlewares.verifyJwt.verifyToken, middlewares.filesUpload.single("image_file")], portfolioController.update);

/*
 * DELETE
 */
router.delete('/portfolio/delete', [middlewares.verifyJwt.verifyToken], portfolioController.remove);

router.get('/portfolio/tier/all', portfolioController.getAllTier);

router.get('/portfolio/tier/all-by-portfolio', portfolioController.getAllTierByPortfolio);

router.get('/portfolio/tier', portfolioController.getTier);

router.post('/portfolio/tier/create', [middlewares.verifyJwt.verifyToken, middlewares.filesUpload.array("images", 6)], portfolioController.createTier);

// router.put('/portfolio/tier/update', [middlewares.verifyJwt.verifyToken, middlewares.filesUpload.array("images", 6)], portfolioController.updateTier);

// router.delete('/portfolio/tier/delete', [middlewares.verifyJwt.verifyToken], portfolioController.deleteTier);

module.exports = router;

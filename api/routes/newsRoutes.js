var express = require('express');
var router = express.Router();
var newsController = require('../controllers/newsController.js');
var middlewares = require('../middlewares/index')

/*
 * GET
 */
router.get('/news/all', newsController.list);

/*
 * GET
 */
router.get('/news', newsController.show);

/*
 * POST
 */
router.post('/news/add', [middlewares.verifyJwt.verifyToken, middlewares.filesUpload.single("image_file")], newsController.create);

/*
 * PUT
 */
router.put('/news/edit', newsController.update);

/*
 * DELETE
 */
router.delete('/news/delete', newsController.remove);

module.exports = router;

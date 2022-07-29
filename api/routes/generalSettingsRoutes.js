var express = require("express");
var router = express.Router();
var generalSettingsController = require("../controllers/generalSettingsController.js");
var middlewares = require("../middlewares/index");

/*
 * GET
 */
router.get("/settings/general/all", generalSettingsController.list);

/*
 * GET
 */
router.get("/settings/general", generalSettingsController.show);

/*
 * POST
 */
router.post(
  "/settings/general/create",
  [
    middlewares.verifyJwt.verifyToken,
    middlewares.filesUpload.single("jumbotron_image"),
  ],
  generalSettingsController.create
);

/*
 * PUT
 */
router.put(
  "/settings/general/update",
  [
    middlewares.verifyJwt.verifyToken,
    middlewares.filesUpload.single("jumbotron_image"),
  ],
  generalSettingsController.update
);

/*
 * DELETE
 */
router.delete("/settings/general/remove", middlewares.verifyJwt.verifyToken, generalSettingsController.remove);

module.exports = router;

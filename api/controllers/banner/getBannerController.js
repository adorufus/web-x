const mongoose = require("mongoose");
const { storage } = require("firebase-admin");
const Banner = mongoose.model("Banner");

module.exports.getAllBanner = (req, res) => {
  Banner.find({}, (err, banners) => {
    if (err) {
      return res.status(400).json({
        status: "error",
        error: err,
      });
    } else {
      return res.status(200).json({
        status: "success",
        message: "Banner Found",
        data: banners,
      });
    }
  });
};

module.exports.getBanner = (req, res) => {
  var id = req.query.id;

  Banner.findById(id, (err, banner) => {
    if (err) {
      return res.status(400).json({
        status: "error",
        error: err,
      });
    } else {
      if (banner) {
        return res.status(200).json({
          status: "success",
          message: "Banner found!",
          data: banner,
        });
      } else {
        return res.status(400).json({
          status: "error",
          error: "Banner not found",
        });
      }
    }
  });
};

module.exports.editBanner = async (req, res) => {
  var { banner_id, banner_name, go_to_url } = req.body;

  if(banner_id) { 
    Banner.findById(banner_id, (err, banner) => {
        if (err) {
          return res.status(400).json({
            status: "error",
            error: err,
          });
        } else {
          if (banner) {
            updateImageBucket(req.file, banner["metaname"]).then((value) => {
              const metaname = value[1]["name"];
    
              value[0]
                .getSignedUrl({
                  action: "read",
                  expires: "03-09-4000",
                })
                .then((signedUrls) => {
                  const bannerModel = new Banner();
                  bannerModel.bannerName = banner_name;
                  bannerModel.url = go_to_url;
                  bannerModel.metaname = metaname;
                  bannerModel.bannerFile = signedUrls[0];
    
                  Banner.findByIdAndUpdate(banner_id, bannerModel, (err, data) => {
                    if (err) {
                      return res.status(400).json({
                        status: "failed",
                        error: err,
                      });
                    } else {
                      return res.status(200).json({
                        status: "success",
                        message: "Banner Updated",
                        data: data,
                      });
                    }
                  });
                })
                .catch((err) => {
                  console.log(err);
                });
            });
          } else {
            return res.status(400).json({
              status: "error",
              error: "Banner not found",
            });
          }
        }
      });
  } else {
      return res.status(400).json({
          status: "failed",
          message: "field: Id is required!"
      })
  }
};

const updateImageBucket = async (file, metaname) => {
  const bucket = storage().bucket();

  await bucket.file(metaname).delete();
  return await bucket.upload(file.path, {
    metadata: {
      contentType: file.mimetype,
    },
  });
};

const mongoose = require("mongoose");
const { storage } = require("firebase-admin");
const Banner = mongoose.model("Banner");
const image_kit = require("imagekit");
const cloudinary = require("cloudinary");
const { sample } = require("lodash");

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

  if (banner_id) {
    Banner.findById(banner_id, (err, banner) => {
      if (err) {
        return res.status(400).json({
          status: "error",
          error: err,
        });
      } else {
        if (banner) {
          updateImageBucket(req.file, banner["metaname"], res).then((value) => {
            console.log(value);
            // const bannerModel = new Banner();
            // bannerModel.bannerName = banner_name;
            // bannerModel.url = go_to_url;
            // bannerModel.metaname = value["public_id"];
            // bannerModel.bannerFile = value["secure_url"];

            Banner.findByIdAndUpdate(
              banner_id,
              {
                bannerName: banner_name,
                url: go_to_url,
                metaname: value["public_id"],
                bannerFile: value["secure_url"],
              },
              (err, data) => {
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
              }
            );
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
      message: "field: Id is required!",
    });
  }
};

module.exports.deleteBannerController = async (req, res) => {
  const banner_id = req.query.banner_id;

  Banner.findById(banner_id, async (err, banner) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        status: "failed!",
        error: err,
      });
    } else {
      if (banner) {
        await deleteBanner(banner["metaname"], res).then((value) => {
          if (value == "deleted") {
            Banner.findByIdAndDelete(banner_id, (err, banner) => {
              if (err) {
                return res.status(400).json({
                  status: "failed",
                  error: err,
                });
              } else {
                return res.status(200).json({
                  status: "success",
                  message: "Image deleted.",
                });
              }
            });
          } else {
            return res.status(400).json({
              status: "error",
              error: "Banner not found",
            });
          }
        });
      }
    }
  });
};

const updateImageBucket = async (file, metaname, res) => {
  var data;

  await deleteBanner(metaname, res);

  await cloudinary.v2.uploader.upload(file.path, (err, uploadResult) => {
    if (err) {
      return res.status(400).json({
        status: "error",
        type: "cloudinary upload",
        error: err,
      });
    } else {
      data = {
        public_id: uploadResult.public_id,
        secure_url: uploadResult.secure_url,
      };
    }
  });

  return data;
};

const deleteBanner = async (metaname, res) => {
  var data;
  await cloudinary.v2.uploader.destroy(metaname, async (err, result) => {
    if (err) {
      console.log("Cloudinary error: " + err);
      return res.status(400).json({
        status: "error",
        type: "cloudinary delete",
        error: err,
      });
    } else {
      console.log("Cloudinary response: " + JSON.stringify(result));
      data = "deleted";
    }
  });

  return data;
};

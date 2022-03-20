const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");
const { storage } = require("firebase-admin");
const uuidv4 = require("uuidv4");

const Banner = mongoose.model("Banner");

const addBannerController = async (req, res) => {
  const { file_name, go_to_url } = req.body;

  console.log(file_name);
  console.log(go_to_url);

  var banner = new Banner();

  uploadImage(req.file).then((value) => {
    value[0]
      .getSignedUrl({
        action: "read",
        expires: "03-09-4000",
      })
      .then((signedUrls) => {
        console.log(signedUrls);

        banner.bannerName = file_name;
        banner.url = go_to_url;
        banner.bannerFile = signedUrls[0];

        console.log(value);

        banner.save((err, doc) => {
          if (err) {
            console.log(err);
            return res.status(400).json({
              status: "error",
              error: err,
            });
          } else {
            return res.status(201).json({
              status: "success",
              message: "image uploaded",
            });
          }
        });
      })
      .catch((err) => {
        console.log("error: " + err);
        res.status(400).json({
          status: "error",
          error: err,
        });
      });
  });
};

const uploadImage = async (file) => {
  const bucket = storage().bucket();

  return await bucket.upload(file.path, {
    metadata: {
      contentType: file.mimetype,
    },
  });
};

module.exports = addBannerController;

const e = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const lodash = require("lodash");

var User = mongoose.model("User");

module.exports.getUser = function getUserDetails(req, res) {
  var userId = req.query.id;

  if (!userId) {
    User.findOne({ _id: req._id }, (err, user) => {
      if (!user)
        return res.status(400).json({
          status: "error",
          message: "Sorry, but that user didn't exists",
        });
      else
        return res.status(200).json({
          status: "success",
          message: "User detail found",
          data: lodash.pick(user, ["_id", "fullName", "email", "username", "role"]),
        });
    });
  } else {
    User.findOne({ _id: userId }, (err, user) => {
      if (!user)
        return res.status(400).json({
          status: "error",
          message: "Sorry, but that user didn't exists",
        });
      else
        return res.status(200).json({
          status: "success",
          message: "User detail found",
          data: lodash.pick(user, ["_id", "fullName", "email", "username", "role"]),
        });
    });
  }
};

module.exports.getAllUser = function (req, res) {
  User.find({}, (err, users) => {
    if (users.length != 0) {
      res.status(200).json({
        status: "success",
        message: "All user data found",
        data: lodash.chain(users).map((user) =>
          lodash.pick(user, ["_id", "fullName", "email", "username", "role"])
        ),
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "No user has been registered yet",
      });
    }
  });
};

module.exports.updateUser = function (req, res) {
  var { userId, username, email, fullname, role } = req.body;

  User.findByIdAndUpdate(
    userId,
    {
      username: username,
      email: email,
      fullName: fullname,
      role: role,
    },
    (err, doc) => {
      if (err) {
        return res.status(403).json({
          status: "error",
          message: "something went wrong",
          error: err,
        });
      } else {
        if (doc) {
          return res.status(200).json({
            status: "success",
            message: "User data updated",
          });
        } else {
          return res.status(400).json({
            status: "unknown",
            message: "error",
          });
        }
      }
    }
  );
};

module.exports.deleteUser = function (req, res) {
  var userId = req.body.id;

  if (userId) {
    User.findByIdAndRemove({ _id: userId }, (err, user) => {
      if (err) {
        console.log(err);
        // print("message")
        return res.status(400).json({
          status: "error",
          message: "something went wrong",
          error: err,
        });
      } else {
        if (user) {
          return res.status(200).json({
            status: "success",
            message: "Delete User Success",
          });
        } else {
          return res.status(404).json({
            status: "failed",
            message: "User not found",
          });
        }
      }
    });
  } else {
    return res.status(400).json({
      status: "failed",
      message: "You need to enter the user id!",
    });
  }
};

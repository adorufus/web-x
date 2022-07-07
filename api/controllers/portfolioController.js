var PortfolioModel = require("../models/portfolioModel.js");
const _ = require("lodash");
const mongoose = require("mongoose");
const uploadImage = require("../utils/imageUploader");

var PortfolioCategoryModel = mongoose.model('portfolioCategory')

/**
 * portfolioController.js
 *
 * @description :: Server-side logic for managing portfolios.
 */
module.exports = {
  /**
   * portfolioController.list()
   */
  list: function (req, res) {
    PortfolioModel.find(function (err, portfolios) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting portfolio.",
          error: err,
        });
      }

      return res.json(portfolios);
    });
  },

  category: function (req, res) {
    var id = req.query.id;
    PortfolioCategoryModel.findOne({ _id: id }, function (err, category) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting category",
          error: err,
        });
      }

      if (!category) {
        return res.status(404).json({
          message: "No such category",
        });
      }

      return res.status(200).json({
        message: "success",
        data: category,
      });
    });
  },

  allCategory: function (req, res) {
    PortfolioCategoryModel.find(function (err, categories) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting portfolio.",
          error: err,
        });
      }

      return res.status(200).json({
        message: "success",
        data: categories,
      });
    });
  },

  createCategory: async function (req, res) {
    const {category_name} = req.body;

    var category = new PortfolioCategoryModel();

    await uploadImage(req.file)
      .then((value) => {
        console.log(value);
        category.metaname = value["public_id"];
        category.category_image_file = value["secure_url"];
      })
      .catch((err) => {
        console.log(err);
      });

    category.category_name = category_name;

    category.save(async function (err, doc) {
      if (err) {
        console.log(err);
        return res.status(400).json({
          status: "error",
          error: err,
        });
      } else {
        return res.status(201).json({
          status: "success",
          message: "Category created",
        });
      }
    });
  },

  deleteCategory: async function (req, res) {
    var id = req.query.id;

    PortfolioCategoryModel.findByIdAndRemove(id, function (err, category) {
      if (err) {
        return res.status(500).json({
          message: "Error when deleting the news.",
          error: err,
        });
      }

      if(!category) {
        return res.status(404).json({
          status: "error",
          message: "Category not found"
        })
      }

      return res.status(200).json({
        status: "success",
        message: "Category Deleted"
      });
    });
  },

  /**
   * portfolioController.show()
   */
  show: function (req, res) {
    var id = req.params.id;

    PortfolioModel.findOne({ _id: id }, function (err, portfolio) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting portfolio.",
          error: err,
        });
      }

      if (!portfolio) {
        return res.status(404).json({
          message: "No such portfolio",
        });
      }

      return res.json(portfolio);
    });
  },

  /**
   * portfolioController.create()
   */
  create: function (req, res) {
    var portfolio = new PortfolioModel({
      title: req.body.title,
      image: req.body.image,
    });

    portfolio.save(function (err, portfolio) {
      if (err) {
        return res.status(500).json({
          message: "Error when creating portfolio",
          error: err,
        });
      }

      return res.status(201).json(portfolio);
    });
  },

  /**
   * portfolioController.update()
   */
  update: function (req, res) {
    var id = req.params.id;

    PortfolioModel.findOne({ _id: id }, function (err, portfolio) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting portfolio",
          error: err,
        });
      }

      if (!portfolio) {
        return res.status(404).json({
          message: "No such portfolio",
        });
      }

      portfolio.title = req.body.title ? req.body.title : portfolio.title;
      portfolio.image = req.body.image ? req.body.image : portfolio.image;

      portfolio.save(function (err, portfolio) {
        if (err) {
          return res.status(500).json({
            message: "Error when updating portfolio.",
            error: err,
          });
        }

        return res.json(portfolio);
      });
    });
  },

  /**
   * portfolioController.remove()
   */
  remove: function (req, res) {
    var id = req.params.id;

    PortfolioModel.findByIdAndRemove(id, function (err, portfolio) {
      if (err) {
        return res.status(500).json({
          message: "Error when deleting the portfolio.",
          error: err,
        });
      }

      return res.status(204).json();
    });
  },
};

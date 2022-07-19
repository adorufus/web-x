const _ = require("lodash");
const mongoose = require("mongoose");
const uploadImage = require("../utils/imageUploader");

var PortfolioCategoryModel = mongoose.model("PortfolioCategory");
var PortfolioModel = mongoose.model("Portfolio");
var TierModel = mongoose.model("Tier");

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

  getCategory: async function (req, res) {
    var id = req.query.id;

    await PortfolioCategoryModel.findOne({ _id: id })
      .populate("tier_list")
      .exec(function (err, category) {
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
    const { category_name } = req.body;

    var category = new PortfolioCategoryModel();

    await uploadImage(req.file)
      .then((value) => {
        console.log(value);
        category._id = new mongoose.Types.ObjectId();
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

  updateCategory: async function (req, res) {
    var { category_name } = req.body;
    var id = req.query.id;

    var category = new PortfolioCategoryModel();

    PortfolioCategoryModel.findOne({ _id: id }, async function (err, cat) {
      if (err) {
        console.log(err);
        return res.status(400).json({
          status: "error",
          error: err,
        });
      }

      if (!cat) {
        return res.status(404).json({
          status: "error",
          error: "Category Not Found",
        });
      }

      await uploadImage(req.file)
        .then((value) => {
          console.log(value);
          cat.metaname = value["public_id"];
          cat.category_image_file = value["secure_url"];
        })
        .catch((err) => {
          console.log(err);
        });

      cat.category_name = category_name;

      cat.save(async function (err, doc) {
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
            data: doc,
          });
        }
      });
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

      if (!category) {
        return res.status(404).json({
          status: "error",
          message: "Category not found",
        });
      }

      TierModel.findByIdAndRemove(category.tier_list, function (err2, tier) {
        if (err2) {
          return res.status(500).json({
            message: "Error when deleting the news.",
            error: err,
          });
        }

        if (!tier) {
          return res.status(404).json({
            status: "error",
            message: "Category not found",
          });
        }

        return res.status(200).json({
          status: "success",
          message: "Category Deleted",
        });
      });
    });
  },

  deleteTier: async function (req, res) {
    var id = req.query.id;

    TierModel.findByIdAndRemove(id, function (err, tier) {
      if (err) {
        return res.status(500).json({
          message: "Error when deleting the portfolio.",
          error: err,
        });
      }

      return res.status(200).json({
        status: "Success",
        message: "Delete successfull",
      });
    });
  },

  ///Tier Controller
  getTier: async function (req, res) {
    var { id } = req.query;

    await TierModel.findOne({ _id: id }, (err, tier) => {
      if (err) {
        return res.status(400).json({
          status: "failure",
          message: err,
        });
      }

      if (!tier) {
        return res.status(404).json({
          status: "failure",
          message: "No such tier found",
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Tier found",
        data: tier,
      });
    });
  },

  getAllTierByPortfolio: function (req, res) {
    var portfolioId = req.query.portfolioId;

    TierModel.find({ category_id: portfolioId }, (err, tiers) => {
      if (err) {
        return res.status(400).json({
          status: "failure",
          message: err,
        });
      }

      if (!tiers) {
        return res.status(404).json({
          status: "failure",
          message: "Tier is empty",
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Tier found",
        data: tiers,
      });
    });
  },

  getAllTier: async function (req, res) {
    await TierModel.find((err, tiers) => {
      if (err) {
        return res.status(400).json({
          status: "failure",
          message: err,
        });
      }

      if (!tiers) {
        return res.status(404).json({
          status: "failure",
          message: "Tier is empty",
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Tier found",
        data: tiers,
      });
    });
  },

  createTier: async function (req, res) {
    var files = req.files;

    var { categoryId, tier_name, youtube_url, tier_description } = req.body;

    var tier = new TierModel();

    tier.category_id = categoryId;
    tier.tier_name = tier_name;
    tier.tier_description = tier_description;
    tier.youtube_url = youtube_url;

    for (const file of files) {
      console.log("uploading");
      await uploadImage(file)
        .then(async (value) => {
          console.log(value);
          tier.metanames.push(value["public_id"]);
          console.log("sukses");
          tier.tier_portofolio_images.push(value["secure_url"]);
          console.log("sukses");
        })
        .catch((err) => {
          console.log(err);
        });
    }

    PortfolioCategoryModel.findOne({ _id: categoryId }, (err, portfolio) => {
      if (err) {
        return res.status(400).json({
          status: "failure",
          message: err,
        });
      }

      if (!portfolio) {
        return res.status(404).json({
          status: "failure",
          message: "portfolio not found",
        });
      }

      portfolio.tier_list.push(tier);
      portfolio.save((portErr, data) => {
        if (err) {
          return res.status(400).json({
            status: "failure",
            message: portErr,
          });
        }

        tier.save((tierErr, tierData) => {
          if (err) {
            return res.status(400).json({
              status: "failure",
              message: tierErr,
            });
          }

          return res.status(201).json({
            status: "success",
            message: "tier created",
            data: tierData,
          });
        });
      });
    });
  },

  /**
   * portfolioController.show()
   */
  show: async function (req, res) {
    var id = req.query.id;

    await PortfolioModel.findOne({ _id: id })
      .populate("tier_list")
      .exec(function (err, portfolio) {
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
      _id: new mongoose.Types.ObjectId(),
      title: req.body.title,
      category_id: req.body.category_id,
    });

    portfolio.save(function (err, portfolio) {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Error when creating portfolio",
          error: err,
        });
      }

      PortfolioCategoryModel.findOne(
        { _id: req.body.category_id },
        (err, category) => {
          if (category) {
            category.portfolio = portfolio;
            category.save(function (catErr, data) {
              if (catErr) {
                return res.status(500).json({
                  message: "Error when creating portfolio",
                  error: err,
                });
              }

              return res.status(201).json({
                status: "success",
                message: "portfolio created",
                data: portfolio,
              });
            });
          }
        }
      );
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
    var id = req.query.id;

    PortfolioModel.findByIdAndRemove(id, function (err, portfolio) {
      if (err) {
        return res.status(500).json({
          message: "Error when deleting the portfolio.",
          error: err,
        });
      }

      return res.status(204).json({
        status: "Success",
        message: "Delete successfull",
      });
    });
  },
};

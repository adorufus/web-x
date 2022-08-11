const lodash = require('lodash')
const mongoose = require('mongoose')
const uploadImage = require('../utils/imageUploader')

var PortfolioCategoryModel = mongoose.model('PortfolioCategory')
var PortfolioModel = mongoose.model('Portfolio')
var TierModel = mongoose.model('Tier')
var FileModel = mongoose.model('file')

var baseFileUrl = 'https://103.163.139.152:8080/files/'

const getItems = (files, types, req, res) =>
  new Promise((resolve) => {
    items = []
    for (var i = 0; i < files.length; i++) {
      console.log('uploading')
        var fileModel = new FileModel()
        fileModel.url = baseFileUrl + files[i].filename
        fileModel.type = types[i]
        fileModel.save((err, fileData) => {
          if (err) {
            return res.status(400).json({
              status: 'failure',
              error: err,
            })
          }

          items.push(fileData._id)
        })
    }

    setTimeout(() => resolve(items), 1000)
  })

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
          message: 'Error when getting portfolio.',
          error: err,
        })
      }

      return res.json(portfolios)
    })
  },

  getCategory: async function (req, res) {
    var id = req.query.id

    await PortfolioCategoryModel.findOne({ _id: id })
      .populate({
        path: 'tier_list',
        populate: {
          path: 'tier_portofolio_files',
        },
      })
      .exec(function (err, category) {
        if (err) {
          return res.status(500).json({
            message: 'Error when getting category',
            error: err,
          })
        }

        if (!category) {
          return res.status(404).json({
            message: 'No such category',
          })
        }

        return res.status(200).json({
          message: 'success',
          data: category,
        })
      })
  },

  allCategory: function (req, res) {
    PortfolioCategoryModel.find(function (err, categories) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting portfolio.',
          error: err,
        })
      }

      return res.status(200).json({
        message: 'success',
        data: categories,
      })
    })
  },

  createCategory: async function (req, res) {
    const { category_name } = req.body

    var file = req.file

    var category = new PortfolioCategoryModel()

    category._id = new mongoose.Types.ObjectId()
    category.category_image_file = `${baseFileUrl}${file.filename}`

    category.category_name = category_name

    category.save(async function (err, doc) {
      if (err) {
        console.log(err)
        return res.status(400).json({
          status: 'error',
          error: err,
        })
      } else {
        return res.status(201).json({
          status: 'success',
          message: 'Category created',
        })
      }
    })
  },

  updateCategory: async function (req, res) {
    var { category_name } = req.body
    var id = req.query.id
    var file = req.file

    var category = new PortfolioCategoryModel()

    PortfolioCategoryModel.findOne({ _id: id }, async function (err, cat) {
      if (err) {
        console.log(err)
        return res.status(400).json({
          status: 'error',
          error: err,
        })
      }

      if (!cat) {
        return res.status(404).json({
          status: 'error',
          error: 'Category Not Found',
        })
      }

      cat.category_image_file = `${baseFileUrl}${file.filename}`

      cat.category_name = category_name

      cat.save(async function (err, doc) {
        if (err) {
          console.log(err)
          return res.status(400).json({
            status: 'error',
            error: err,
          })
        } else {
          return res.status(201).json({
            status: 'success',
            message: 'Category created',
            data: doc,
          })
        }
      })
    })
  },

  deleteCategory: async function (req, res) {
    var id = req.query.id

    PortfolioCategoryModel.findByIdAndRemove(id, function (err, category) {
      if (err) {
        return res.status(500).json({
          message: 'Error when deleting the news.',
          error: err,
        })
      }

      if (!category) {
        return res.status(404).json({
          status: 'error',
          message: 'Category not found',
        })
      }

      TierModel.findByIdAndRemove(category.tier_list, function (err2, tier) {
        if (err2) {
          return res.status(500).json({
            message: 'Error when deleting the news.',
            error: err,
          })
        }

        if (!tier) {
          return res.status(404).json({
            status: 'error',
            message: 'Category not found',
          })
        }

        return res.status(200).json({
          status: 'success',
          message: 'Category Deleted',
        })
      })
    })
  },

  deleteTier: async function (req, res) {
    var id = req.query.id

    TierModel.findByIdAndRemove(id, function (err, tier) {
      if (err) {
        return res.status(500).json({
          message: 'Error when deleting the portfolio.',
          error: err,
        })
      }

      return res.status(200).json({
        status: 'Success',
        message: 'Delete successfull',
      })
    })
  },

  ///Tier Controller
  getTier: async function (req, res) {
    var { id } = req.query

    TierModel.findOne({ _id: id })
      .populate('tier_portofolio_files')
      .exec((err, tier) => {
        if (err) {
          return res.status(400).json({
            status: 'failure',
            message: err,
          })
        }

        if (!tier) {
          return res.status(404).json({
            status: 'failure',
            message: 'No such tier found',
          })
        }

        return res.status(200).json({
          status: 'success',
          message: 'Tier found',
          data: tier,
        })
      })
  },

  getAllTierByPortfolio: function (req, res) {
    var portfolioId = req.query.portfolioId

    TierModel.find({ category_id: portfolioId }).populate("tier_portofolio_files").exec((err, tiers) => {
      if (err) {
        return res.status(400).json({
          status: 'failure',
          message: err,
        })
      }

      if (!tiers) {
        return res.status(404).json({
          status: 'failure',
          message: 'Tier is empty',
        })
      }

      return res.status(200).json({
        status: 'success',
        message: 'Tier found',
        data: tiers,
      })
    })
  },

  getAllTier: async function (req, res) {
    await TierModel.find((err, tiers) => {
      if (err) {
        return res.status(400).json({
          status: 'failure',
          message: err,
        })
      }

      if (!tiers) {
        return res.status(404).json({
          status: 'failure',
          message: 'Tier is empty',
        })
      }

      return res.status(200).json({
        status: 'success',
        message: 'Tier found',
        data: tiers,
      })
    })
  },

  createTier: async function (req, res) {
    var files = req.files

    var {
      categoryId,
      tier_name,
      youtube_url,
      tier_description,
      fileType,
    } = req.body

    var tier = new TierModel()

    tier.category_id = categoryId
    tier.tier_name = tier_name
    tier.tier_description = tier_description
    tier.youtube_url = youtube_url

    await getItems(files, fileType, req, res).then((result) => {
      tier.tier_portofolio_files = result
    })

    PortfolioCategoryModel.findOne({ _id: categoryId }, (err, portfolio) => {
      if (err) {
        return res.status(400).json({
          status: 'failure',
          message: err,
        })
      }

      if (!portfolio) {
        return res.status(404).json({
          status: 'failure',
          message: 'portfolio not found',
        })
      }

      portfolio.tier_list.push(tier)
      portfolio.save((portErr, data) => {
        if (err) {
          return res.status(400).json({
            status: 'failure',
            message: portErr,
          })
        }

        tier.save((tierErr, tierData) => {
          if (err) {
            return res.status(400).json({
              status: 'failure',
              message: tierErr,
            })
          }

          return res.status(201).json({
            status: 'success',
            message: 'tier created',
            data: tierData,
          })
        })
      })
    })
  },

  /**
   * portfolioController.show()
   */
  show: async function (req, res) {
    var id = req.query.id

    await PortfolioModel.findOne({ _id: id })
      .populate('tier_list')
      .exec(function (err, portfolio) {
        if (err) {
          return res.status(500).json({
            message: 'Error when getting portfolio.',
            error: err,
          })
        }

        if (!portfolio) {
          return res.status(404).json({
            message: 'No such portfolio',
          })
        }

        return res.json(portfolio)
      })
  },

  /**
   * portfolioController.create()
   */
  create: function (req, res) {
    var portfolio = new PortfolioModel({
      _id: new mongoose.Types.ObjectId(),
      title: req.body.title,
      category_id: req.body.category_id,
    })

    portfolio.save(function (err, portfolio) {
      if (err) {
        console.log(err)
        return res.status(500).json({
          message: 'Error when creating portfolio',
          error: err,
        })
      }

      PortfolioCategoryModel.findOne(
        { _id: req.body.category_id },
        (err, category) => {
          if (category) {
            category.portfolio = portfolio
            category.save(function (catErr, data) {
              if (catErr) {
                return res.status(500).json({
                  message: 'Error when creating portfolio',
                  error: err,
                })
              }

              return res.status(201).json({
                status: 'success',
                message: 'portfolio created',
                data: portfolio,
              })
            })
          }
        },
      )
    })
  },

  /**
   * portfolioController.update()
   */
  update: function (req, res) {
    var id = req.params.id

    PortfolioModel.findOne({ _id: id }, function (err, portfolio) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting portfolio',
          error: err,
        })
      }

      if (!portfolio) {
        return res.status(404).json({
          message: 'No such portfolio',
        })
      }

      portfolio.title = req.body.title ? req.body.title : portfolio.title
      portfolio.image = req.body.image ? req.body.image : portfolio.image

      portfolio.save(function (err, portfolio) {
        if (err) {
          return res.status(500).json({
            message: 'Error when updating portfolio.',
            error: err,
          })
        }

        return res.json(portfolio)
      })
    })
  },

  /**
   * portfolioController.remove()
   */
  remove: function (req, res) {
    var id = req.query.id

    PortfolioModel.findByIdAndRemove(id, function (err, portfolio) {
      if (err) {
        return res.status(500).json({
          message: 'Error when deleting the portfolio.',
          error: err,
        })
      }

      return res.status(204).json({
        status: 'Success',
        message: 'Delete successfull',
      })
    })
  },
}

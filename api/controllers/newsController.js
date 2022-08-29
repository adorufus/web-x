var NewsModel = require('../models/newsModel.js')
const uploadImage = require('../utils/imageUploader')
const cloudinary = require('cloudinary')

var baseFileUrl = 'https://103.163.139.152:8080/files/'

/**
 * newsController.js
 *
 * @description :: Server-side logic for managing news.
 */
module.exports = {
  /**
   * newsController.list()
   */
  list: function (req, res) {
    NewsModel.find(function (err, news) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting news.',
          error: err,
        })
      }

      if (news.length > 0) {
        return res.status(200).json({
          status: 'success',
          message: 'news found!',
          data: news,
        })
      } else {
        return res.status(400).json({
          status: 'failure',
          message: 'news empty!',
          data: news,
        })
      }
    })
  },

  /**
   * newsController.show()
   */
  show: function (req, res) {
    var id = req.query.id

    NewsModel.findOne({ _id: id }, function (err, news) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting news.',
          error: err,
        })
      }

      if (!news) {
        return res.status(404).json({
          message: 'No such news',
        })
      }

      return res.status(200).json({
        status: "success",
        data: news
      })
    })
  },

  /**
   * newsController.create()
   */
  create: async function (req, res) {
    var { article, title } = req.body
    var news = new NewsModel()

    if (req.file) {
      var file = req.file;
      news.image = baseFileUrl + file.filename
      news.thumbnail = baseFileUrl + file.filename
    } else {
      return res.status(400).json({
        status: "failure",
        message: "no image uploaded"
      })
    }

    if (article && title) {
      news.article = article
      news.title = title
      news.save(function (err, news) {
        if (err) {
          return res.status(500).json({
            message: 'Error when creating news',
            error: err,
          })
        }

        return res.status(201).json({
          status: 'success',
          message: 'Article added!',
          data: news,
        })
      })
    } else {
      return res.status(201).json({
        status: 'failure',
        message: 'article or title field is required!',
      })
    }
  },

  /**
   * newsController.update()
   */
  update: function (req, res) {
    var {id} = req.query
    var file = req.file

    NewsModel.findOne({ _id: id }, function (err, news) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting news',
          error: err,
        })
      }

      if (!news) {
        return res.status(404).json({
          message: 'No such news',
        })
      }

      news.image = file ? baseFileUrl + file.filename : news.image
      news.article = req.body.article ? req.body.article : news.article
      news.title = req.body.title ? req.body.title : news.title
      news.thumbnail = file ? baseFileUrl + file.filename : news.thumbnail

      news.save(function (err, news) {
        if (err) {
          return res.status(500).json({
            message: 'Error when updating news.',
            error: err,
          })
        }

        return res.json(news)
      })
    })
  },

  /**
   * newsController.remove()
   */
  remove: function (req, res) {
    var id = req.query.id

    NewsModel.findByIdAndRemove(id, function (err, news) {
      if (err) {
        return res.status(500).json({
          message: 'Error when deleting the news.',
          error: err,
        })
      }

      if (!news) {
        return res.status(404).json({
          status: 'error',
          message: 'News not found',
        })
      }

      return res.status(200).json({
        status: 'success',
        message: 'News Deleted',
      })
    })
  },
}

const express = require('express')
const mongoose = require('mongoose')
const _ = require('lodash')
const { storage } = require('firebase-admin')
const uuidv4 = require('uuidv4')
const cloudinary = require('cloudinary')
const uploadImage = require('../../utils/imageUploader')

const Banner = mongoose.model('Banner')
var baseFileUrl = 'https://103.163.139.152:8080/files/'

const addBannerController = async (req, res) => {
  const { file_name, go_to_url } = req.body
  var file = req.file
  console.log(file_name)
  console.log(go_to_url)

  var banner = new Banner()

  banner.bannerName = file_name
  banner.url = go_to_url
  banner.bannerFile = baseFileUrl + file.filename

  banner.save((err, doc) => {
    if (err) {
      console.log(err)
      return res.status(400).json({
        status: 'error',
        error: err,
      })
    } else {
      return res.status(201).json({
        status: 'success',
        message: 'image uploaded',
      })
    }
  })
}

module.exports = addBannerController

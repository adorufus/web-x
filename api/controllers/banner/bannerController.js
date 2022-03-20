const express = require('express')
const mongoose = require("mongoose")
const _ = require("lodash")

module.exports.addBanner = function (req, res) {
    return res.status(200).json({
        "success": "test"
    })
}
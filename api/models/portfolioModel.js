var mongoose = require('mongoose')
var Schema = mongoose.Schema

var portfolioSchema = new Schema({
  title: { type: String, required: true },
  image: { data: Buffer, type: String, required: true },
  categoryId: { type: String, required: true },
  tier: { type: Number, required: true },
})

module.exports = mongoose.model('portfolio', portfolioSchema)

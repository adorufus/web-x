var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var portfolioCategorySchema = new Schema({
  category_name: {
    type: String,
    required: true,
  },
  metaname: {
    type: String,
    required: true,
  },
  category_image_file: {
    data: Buffer,
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("portfolioCategory", portfolioCategorySchema);

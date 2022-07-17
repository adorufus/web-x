var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var portfolioCategorySchema = new mongoose.Schema({
  _id: Schema.ObjectId,
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
  portfolio: {
    type: Schema.Types.ObjectId,
    ref: "Portfolio",
  },
});

mongoose.model("PortfolioCategory", portfolioCategorySchema);
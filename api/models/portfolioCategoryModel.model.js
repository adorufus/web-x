var mongoose = require("mongoose");

var portfolioCategorySchema = new mongoose.Schema({
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

mongoose.model("portfolioCategory", portfolioCategorySchema);

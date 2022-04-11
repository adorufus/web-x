var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var newsSchema = new Schema({
  image: String,
  article: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  thumbnail: String,
  metaname: String,
});

module.exports = mongoose.model("news", newsSchema);

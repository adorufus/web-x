var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var portfolioSchema = new Schema({
  _id: Schema.ObjectId,
  title: { type: String, required: true },
  category_id: {
    type: Schema.Types.ObjectId,
    ref: "PortfolioCategory",
  },
  tier_list: [{
    type: Schema.Types.ObjectId,
    ref: "Tier"
  }]
});

var tierSchema = new Schema({
  tier_name: {
    type: String,
    required: true,
  },
  youtube_url: {
    type: String,
    required: true,
  },
  tier_portofolio_files: [
    {
      type: Schema.Types.ObjectId,
      ref: "file",
      required: true,
    },
  ],
  category_id: {
    type: Schema.Types.ObjectId,
    ref: "PortfolioCategory",
  },
  tier_description: {
    type: String,
    required: true,
  }
});

var fileSchema = new Schema({
  url: {data: Buffer, type: String, required: true},
  type: {type: String, required: true}
})

mongoose.model("Portfolio", portfolioSchema);
mongoose.model("file", fileSchema);
mongoose.model("Tier", tierSchema);

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
  metanames: [
    {
      type: String,
      required: true,
    },
  ],
  tier_portofolio_images: [
    {
      data: Buffer,
      type: String,
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

mongoose.model("Portfolio", portfolioSchema);
mongoose.model("Tier", tierSchema);

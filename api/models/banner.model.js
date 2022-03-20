const mongoose = require('mongoose')

var bannerSchema = new mongoose.Schema(
    {
        bannerName: {
            type: String,
        },
        url: {
            type: String,
        },
        bannerFile: {
            data: Buffer,
            type: String
        },
    }
)

mongoose.model("Banner", bannerSchema)
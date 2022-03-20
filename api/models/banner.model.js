const mongoose = require('mongoose')

var bannerSchema = new mongoose.Schema(
    {
        bannerName: {
            type: String,
        },
        bannerFile: {
            data: Buffer,
            type: String
        },
    }
)

mongoose.model("Banner", bannerSchema)
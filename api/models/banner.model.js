const mongoose = require('mongoose')

var bannerSchema = new mongoose.Schema(
    {
        bannerName: {
            type: String,
        },
        url: {
            type: String,
        },
        metaname: {
            type: String,
            required: true
        },
        bannerFile: {
            data: Buffer,
            type: String,
            required: true
        },
    }
)

mongoose.model("Banner", bannerSchema)
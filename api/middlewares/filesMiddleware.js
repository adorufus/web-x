const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, callbacks) => {
        callbacks(null, __dirname)
    },
    filename: (req, file, callbacks) => {
        callbacks(null, file.fieldname + "-" + Date.now())
    }
})

const upload = multer({storage: storage})

module.exports = upload
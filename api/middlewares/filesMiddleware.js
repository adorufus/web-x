const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, callbacks) => {
        callbacks(null, 'uploads')
    },
    filename: (req, file, callbacks) => {
        cb(null, file.fieldname + "-" + Date.now())
    }
})

const upload = multer({storage: storage})
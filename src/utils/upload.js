const multer = require('multer');
const upload = multer({
    limits: {
        fileSize: 1000000 //1mb
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(pdf)$/)) {
            return cb(new Error('Acceptable file type: PDF'))
        }

        cb(undefined, true)
    }
})

module.exports = upload 
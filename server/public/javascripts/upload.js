function setUpload(folder) {
  const multer = require('multer')
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `./${folder}`)
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  const upload = multer({
    storage: storage
  })
  return upload
}

module.exports = setUpload
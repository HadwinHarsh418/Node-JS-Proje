const path = require('path')
const multer = require('multer')

var storage = multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null,'uploads/')
    },
    filename: function (req,file,cb) {
        let ext = path.extname(file.originalname)
        cb(null,Date.now() + ext)
    }
})

var uploadImage = multer({
    storage:storage,
    fileFilter: function (req,file,cb) {
       if(file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg')
        cb(null,true)
        else{
            console.log('Only jpg & png files supported');
            cb(null,false)
        }
        
    }
})

module.exports = uploadImage
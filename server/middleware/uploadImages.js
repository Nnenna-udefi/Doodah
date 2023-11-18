const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

// Sets a storage for multer, which it stores on our localdisk
// Then we upload it to Cloudinary
const multerStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, path.join(__dirname, '../public/images/'));
    },
    filename: function(req, file, callback) {
        const suffix = Date.now + Math.round(Math.random() * 1e9)
        callback(null, file.filename + '-' + suffix + '.jpeg')
    }
});

// MulterFilter to check filter the request files
multerFilter = (req, file, callback) => {
    if (file.mimetype.startsWith('image')) {
        callback(null, true)
    } else {
        callback({
            message: 'Unsupported file format, only accepts images',
        }, false)
    }
}

const uploadImage = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: {fieldSize: 1000000}
});

// Resize images and make sharper

const imgResize = async (req, res, next) => {
    // Checks if we have files in the request
    if (!req.files) {
        next();
    }
    await Promise.all(req.files.map( async (file) => {
        await sharp(file.path)
        .resize(300,300).
        toFormat('jpeg').
        jpeg({quality:90})
        .toFile(`../public/images/products/filename/${file.filename}`);
    }
    ))
    next();
}

module.exports = { uploadImage, imgResize };

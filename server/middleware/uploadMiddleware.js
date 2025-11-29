const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

function checkFileType(file, cb) {
    const filetypes = /pdf|pptx|ppt|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype); // Mimetype check can be tricky with some office docs, relying mostly on ext for now or specific mimes if needed

    // For this hackathon, we'll be lenient with mimetypes but strict with extensions
    if (extname) {
        return cb(null, true);
    } else {
        cb('Images/PDF/PPTX only!');
    }
}

const upload = multer({
    storage,
    limits: { fileSize: 10000000 }, // 10MB
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

module.exports = upload;

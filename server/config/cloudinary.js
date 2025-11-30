const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // Force raw for PDFs and documents to prevent corruption/preview errors
        const isRaw = file.mimetype.includes('pdf') ||
            file.mimetype.includes('document') ||
            file.mimetype.includes('presentation');

        return {
            folder: 'hackathon_submissions',
            allowed_formats: ['jpg', 'png', 'pdf', 'doc', 'docx', 'pptx'],
            resource_type: isRaw ? 'raw' : 'auto'
        };
    }
});

module.exports = { cloudinary, storage };

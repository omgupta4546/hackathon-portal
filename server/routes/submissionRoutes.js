const express = require('express');
const router = express.Router();
const { submitWork, getSubmissions } = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, submitWork);
router.get('/', protect, getSubmissions);

module.exports = router;

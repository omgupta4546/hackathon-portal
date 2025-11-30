const express = require('express');
const router = express.Router();
const { getInstructions, updateInstructions } = require('../controllers/instructionController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getInstructions);
router.put('/', protect, admin, updateInstructions);

module.exports = router;

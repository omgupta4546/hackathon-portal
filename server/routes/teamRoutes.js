const express = require('express');
const router = express.Router();
const { createTeam, joinTeam, getMyTeam, leaveTeam } = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createTeam);
router.post('/join', protect, joinTeam);
router.get('/me', protect, getMyTeam);
router.put('/leave', protect, leaveTeam);

module.exports = router;

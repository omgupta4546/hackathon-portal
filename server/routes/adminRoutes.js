const express = require('express');
const router = express.Router();
const { getAllTeams, deleteTeam, updateSubmissionStatus, setWinner, getWinners } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/teams', protect, admin, getAllTeams);
router.delete('/teams/:id', protect, admin, deleteTeam);
router.put('/submissions/:id/status', protect, admin, updateSubmissionStatus);
router.post('/winners', protect, admin, setWinner);
router.get('/winners', getWinners);

module.exports = router;

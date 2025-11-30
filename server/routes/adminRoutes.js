const express = require('express');
const router = express.Router();
const { getAllTeams, deleteTeam, updateSubmissionStatus, setWinner, getWinners, getAllUsers, deleteUser } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/teams', protect, admin, getAllTeams);
router.delete('/teams/:id', protect, admin, deleteTeam);
router.put('/submissions/:id/status', protect, admin, updateSubmissionStatus);
router.post('/winners', protect, admin, setWinner);
router.get('/winners', getWinners);
router.get('/users', protect, admin, getAllUsers);
router.delete('/users/:id', protect, admin, deleteUser);

module.exports = router;

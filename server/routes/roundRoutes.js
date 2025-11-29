const express = require('express');
const router = express.Router();
const { getRounds, createRound, updateRound, uploadScores } = require('../controllers/roundController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getRounds);
router.post('/', protect, admin, createRound);
router.put('/:id', protect, admin, updateRound); // id is roundId like 'round1'
router.put('/:id/scores', protect, admin, uploadScores);

module.exports = router;

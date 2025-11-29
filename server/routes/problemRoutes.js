const express = require('express');
const router = express.Router();
const { getProblems, createProblem, updateProblem, deleteProblem, selectProblem } = require('../controllers/problemController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getProblems);
router.post('/', protect, admin, createProblem);
router.put('/:id', protect, admin, updateProblem);
router.delete('/:id', protect, admin, deleteProblem);
router.post('/select', protect, selectProblem);

module.exports = router;

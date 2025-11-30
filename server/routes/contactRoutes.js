const express = require('express');
const router = express.Router();
const { getContacts, addContact, deleteContact } = require('../controllers/contactController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getContacts);
router.post('/', protect, admin, addContact);
router.delete('/:id', protect, admin, deleteContact);

module.exports = router;

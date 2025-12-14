const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
    createNotification,
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    getBroadcasts,
    deleteBroadcast
} = require('../controllers/notificationController');

// All routes are protected
router.use(protect);

// GET /api/notifications - Get user's notifications
router.get('/', getUserNotifications);

// POST /api/notifications/send - Send notification (Admin Only)
router.post('/send', admin, createNotification);

// GET /api/notifications/broadcasts - Get broadcast history (Admin Only)
router.get('/broadcasts', admin, getBroadcasts);

// DELETE /api/notifications/broadcasts/:batchId - Delete broadcast (Admin Only)
router.delete('/broadcasts/:batchId', admin, deleteBroadcast);

// PUT /api/notifications/:id/read - Mark single as read
router.put('/:id/read', markAsRead);

// PUT /api/notifications/read-all - Mark all as read
router.put('/read-all', markAllAsRead);

module.exports = router;

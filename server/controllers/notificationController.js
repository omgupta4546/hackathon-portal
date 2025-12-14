const Notification = require('../models/Notification');
const User = require('../models/User');
const Team = require('../models/Team');

const { v4: uuidv4 } = require('uuid');

// Create a notification (Admin only usually, or system event)
exports.createNotification = async (req, res) => {
    try {
        const { recipientId, message, type, sendToAll, sendToTeam, teamId } = req.body;
        const sender = req.user._id;

        if (sendToAll) {
            const batchId = uuidv4();
            // Fetch all users
            const users = await User.find({}, '_id');
            const notifications = users.map(user => ({
                recipient: user._id,
                message,
                type: type || 'info',
                batchId,
                sender: sender
            }));

            await Notification.insertMany(notifications);
            return res.status(201).json({ message: `Notification sent to ${notifications.length} users.`, batchId });
        }

        if (sendToTeam) {
            if (!teamId) {
                return res.status(400).json({ message: 'Team ID is required if sending to a team.' });
            }

            const team = await Team.findById(teamId);
            if (!team) {
                return res.status(404).json({ message: 'Team not found.' });
            }

            const batchId = uuidv4();
            // Collect all recipients: leader + members
            const recipients = new Set([team.leaderUserId.toString()]);
            team.members.forEach(m => {
                if (m.userId) recipients.add(m.userId.toString());
            });

            const notifications = Array.from(recipients).map(userId => ({
                recipient: userId,
                message,
                type: type || 'info',
                batchId,
                sender: sender
            }));

            await Notification.insertMany(notifications);
            return res.status(201).json({ message: `Notification sent to team members(${notifications.length} users).`, batchId });
        }

        if (!recipientId) {
            return res.status(400).json({ message: 'Recipient ID is required if not sending to all.' });
        }

        const notification = await Notification.create({
            recipient: recipientId,
            message,
            type: type || 'info',
            sender: sender
        });

        res.status(201).json(notification);
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({ message: 'Server error creating notification' });
    }
};

// Get broadcast history for admin
exports.getBroadcasts = async (req, res) => {
    try {
        // Aggregate to find unique batchIds
        const broadcasts = await Notification.aggregate([
            { $match: { batchId: { $ne: null } } },
            {
                $group: {
                    _id: "$batchId",
                    message: { $first: "$message" },
                    type: { $first: "$type" },
                    createdAt: { $first: "$createdAt" },
                    recipientsCount: { $sum: 1 }
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        res.json(broadcasts);
    } catch (error) {
        console.error('Error fetching broadcasts:', error);
        res.status(500).json({ message: 'Server error fetching broadcasts' });
    }
};

// Delete a broadcast (delete all notifications with this batchId)
exports.deleteBroadcast = async (req, res) => {
    try {
        const { batchId } = req.params;
        const result = await Notification.deleteMany({ batchId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Broadcast not found' });
        }

        res.json({ message: 'Broadcast deleted successfully' });
    } catch (error) {
        console.error('Error deleting broadcast:', error);
        res.status(500).json({ message: 'Server error deleting broadcast' });
    }
};

// Get notifications for the logged-in user
exports.getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .sort({ createdAt: -1 }) // Newest first
            .limit(20); // Limit to last 20 to avoid overload
        res.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Server error fetching notifications' });
    }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findOne({ _id: id, recipient: req.user._id });

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        notification.isRead = true;
        await notification.save();

        res.json(notification);
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ message: 'Server error updating notification' });
    }
};

// Mark all as read for user
exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user._id, isRead: false },
            { $set: { isRead: true } }
        );
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Error marking all as read:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

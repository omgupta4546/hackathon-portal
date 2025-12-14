const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['info', 'alert', 'success', 'warning'],
        default: 'info'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    batchId: {
        type: String, // To group broadcast messages
        default: null
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Admin who sent it
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);

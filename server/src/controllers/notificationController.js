import Notification from '../models/Notification.js';

// Get all notifications for the current user
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .limit(50); // Limit to last 50 notifications

        res.status(200).json({
            success: true,
            data: notifications
        });
    } catch (error) {
        console.error('Fetch notifications error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Mark a single notification as read
export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await Notification.findOneAndUpdate(
            { _id: id, user: req.user.id },
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        res.status(200).json({ success: true, data: notification });
    } catch (error) {
        console.error('Mark read error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { user: req.user.id, read: false },
            { read: true }
        );

        res.status(200).json({ success: true, message: 'All marked as read' });
    } catch (error) {
        console.error('Mark all read error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

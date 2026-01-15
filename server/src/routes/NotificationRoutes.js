import express from 'express';
import { getNotifications, markAsRead, markAllAsRead, createTestNotification } from '../controllers/notificationController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(auth());

router.post('/test', createTestNotification);
router.get('/', getNotifications);
router.put('/:id/read', markAsRead);
router.put('/read-all', markAllAsRead);

export default router;

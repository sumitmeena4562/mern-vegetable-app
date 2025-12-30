import mongoose from 'mongoose'; // 1. require hata kar import kiya

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  title: {
    type: String,
    required: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  
  message: {
    type: String,
    required: true,
    maxlength: [500, 'Message cannot be more than 500 characters']
  },
  
  type: {
    type: String,
    enum: ['order', 'payment', 'market', 'system', 'promotion', 'success', 'error'],
    default: 'system'
  },
  
  data: mongoose.Schema.Types.Mixed,
  
  read: {
    type: Boolean,
    default: false
  },
  
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  
  expiresAt: Date
}, {
  timestamps: true
});

// TTL index for auto-deletion of expired notifications
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for user notifications
notificationSchema.index({ user: 1, read: 1, createdAt: -1 });

// 2. module.exports hata kar export default kiya
const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
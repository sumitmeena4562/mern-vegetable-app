const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    unique: true,
    required: true
  },
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  
  type: {
    type: String,
    enum: ['credit', 'debit', 'refund', 'payout', 'escrow_hold', 'escrow_release'],
    required: true
  },
  
  amount: {
    type: Number,
    required: true,
    min: [1, 'Amount must be at least ₹1']
  },
  
  description: String,
  
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'wallet', 'bank_transfer', 'upi', 'cash']
  },
  
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  
  metadata: mongoose.Schema.Types.Mixed,
  
  // Wallet balance after transaction
  balanceAfter: Number,
  
  // For payouts
  payout: {
    bankDetails: mongoose.Schema.Types.Mixed,
    referenceId: String,
    processedAt: Date
  }
}, {
  timestamps: true
});

// Generate transaction ID before saving
transactionSchema.pre('save', async function(next) {
  if (!this.transactionId) {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.transactionId = `TXN${timestamp}${random}`;
  }
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);
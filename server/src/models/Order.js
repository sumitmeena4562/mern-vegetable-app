import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    required: true
  },

  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  buyerType: {
    type: String,
    enum: ['vendor', 'customer'],
    required: true
  },

  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },

    name: String,
    quantity: {
      type: Number,
      required: true,
      min: [0.1, 'Quantity must be at least 0.1']
    },

    unit: String,
    pricePerUnit: Number,
    totalPrice: Number,

    // Status for individual product
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled', 'returned'],
      default: 'pending'
    }
  }],

  totalAmount: {
    type: Number,
    required: true,
    min: [1, 'Total amount must be at least ₹1']
  },

  discount: {
    type: Number,
    default: 0
  },

  tax: {
    type: Number,
    default: 0
  },

  deliveryCharges: {
    type: Number,
    default: 0
  },

  finalAmount: {
    type: Number,
    required: true
  },

  // Delivery details
  deliveryAddress: {
    name: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    phone: String,
    coordinates: [Number]
  },

  pickupAddress: {
    address: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: [Number]
  },

  // Delivery options
  deliveryType: {
    type: String,
    enum: ['pickup', 'delivery', 'platform_logistics'],
    default: 'pickup'
  },

  preferredPickupTime: String,
  preferredDeliveryTime: String,

  // Order status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'ready_for_pickup',
      'in_transit', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },

  // Payment details
  payment: {
    method: {
      type: String,
      enum: ['online', 'cod', 'wallet', 'credit'],
      required: true
    },

    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
      default: 'pending'
    },

    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,

    paidAt: Date,
    refundedAt: Date
  },

  // Logistics
  logistics: {
    partner: String,
    trackingId: String,
    estimatedDelivery: Date,
    actualDelivery: Date,
    deliveryProof: [String],
    deliveryOtp: {
      type: String,
      select: false
    }
  },

  // Review
  rating: {
    type: Number,
    min: 1,
    max: 5
  },

  review: {
    text: String,
    images: [String],
    createdAt: Date
  },

  // Cancellation
  cancellation: {
    reason: String,
    initiatedBy: String,
    notes: String,
    cancelledAt: Date
  },

  notes: String,

  // Escrow for farmer payment
  escrow: {
    status: {
      type: String,
      enum: ['held', 'released', 'refunded'],
      default: 'held'
    },
    releasedAt: Date,
    transactionId: String
  }
}, {
  timestamps: true
});

// Generate order ID before validation
orderSchema.pre('validate', async function () {
  if (!this.orderId) {
    const prefix = this.buyerType === 'vendor' ? 'V' : 'C';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderId = `ORD${prefix}${timestamp}${random}`;
  }
});

// Indexes
orderSchema.index({ farmer: 1, status: 1 });
orderSchema.index({ buyer: 1, status: 1 });
orderSchema.index({ createdAt: -1 });

// Virtual for total items
orderSchema.virtual('totalItems').get(function () {
  return this.products.reduce((sum, item) => sum + item.quantity, 0);
});

// ✅ CODE QUALITY FIX: Convert to ES6 module syntax for consistency
export default mongoose.model('Order', orderSchema);

const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create order
const createOrder = async (amount, currency = 'INR', receipt) => {
  try {
    const options = {
      amount: amount * 100, // Amount in paise
      currency,
      receipt,
      payment_capture: 1
    };
    
    const order = await razorpay.orders.create(options);
    return { success: true, order };
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    return { success: false, error: error.message };
  }
};

// Verify payment signature
const verifyPayment = (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
  const body = razorpayOrderId + "|" + razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');
  
  return expectedSignature === razorpaySignature;
};

// Create payout
const createPayout = async (accountNumber, ifscCode, amount, name) => {
  try {
    const payout = await razorpay.payouts.create({
      account_number: accountNumber,
      fund_account: {
        account_type: 'bank_account',
        bank_account: {
          name,
          ifsc: ifscCode,
          account_number: accountNumber
        }
      },
      amount: amount * 100,
      currency: 'INR',
      mode: 'IMPS',
      purpose: 'payout'
    });
    
    return { success: true, payout };
  } catch (error) {
    console.error('Razorpay Payout Error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  createPayout
};
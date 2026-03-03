import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Notification from '../models/Notification.js';
import mongoose from 'mongoose';

/**
 * @desc    Create order(s) from vendor cart
 * @route   POST /api/vendors/orders
 * @access  Private (Vendor)
 */
export const createOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { items, deliveryType, paymentMethod, deliveryAddress, notes } = req.body;
        console.log(`🛒 [OrderFlow] Payload Received:`, req.body);
        console.log(`🛒 [OrderFlow] Initiating order creation for user: ${req.user.id}`);
        console.log(`📦 [OrderFlow] Items count: ${items?.length || 0}`);

        if (!items || items.length === 0) {
            console.error('❌ [OrderFlow] Attempted to create order with empty cart');
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ success: false, message: 'Cart is empty' });
        }

        // Group items by farmer
        const farmerGroups = {};
        for (const item of items) {
            const product = await Product.findById(item.productId).session(session).populate('farmer', 'fullName');
            if (!product) {
                console.error(`❌ [OrderFlow] Product not found: ${item.productId}`);
                throw new Error(`Product not found: ${item.productId}`);
            }
            if (product.availableQuantity < item.quantity) {
                console.error(`❌ [OrderFlow] Insufficient stock: ${product.name} (Req: ${item.quantity}, Avail: ${product.availableQuantity})`);
                throw new Error(`Insufficient stock for ${product.name}. Available: ${product.availableQuantity} ${product.unit}`);
            }

            console.log(`✅ [OrderFlow] Checked stock for ${product.name} - OK`);
            const farmerId = product.farmer._id?.toString() || product.farmer.toString();
            if (!farmerGroups[farmerId]) {
                farmerGroups[farmerId] = { farmerId, products: [] };
            }
            farmerGroups[farmerId].products.push({
                product: product._id,
                name: product.name,
                quantity: item.quantity,
                unit: product.unit,
                pricePerUnit: product.pricePerUnit,
                totalPrice: product.pricePerUnit * item.quantity
            });
        }

        // Create one order per farmer
        const createdOrders = [];
        for (const group of Object.values(farmerGroups)) {
            const totalAmount = group.products.reduce((sum, p) => sum + p.totalPrice, 0);

            // Generate order ID explicitly
            const timestamp = Date.now().toString().slice(-6);
            const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            const orderId = `ORDV${timestamp}${random}`;

            const [order] = await Order.create([{
                orderId,
                farmer: group.farmerId,
                buyer: req.user.id,
                buyerType: 'vendor',
                products: group.products,
                totalAmount,
                finalAmount: totalAmount,
                deliveryType: deliveryType || 'pickup',
                deliveryAddress: deliveryAddress || {},
                payment: {
                    method: paymentMethod || 'online',
                    status: 'pending'
                },
                notes: notes || '',
                status: 'pending'
            }], { session });

            // Deduct product stock
            for (const p of group.products) {
                const updatedProduct = await Product.findOneAndUpdate(
                    { _id: p.product, availableQuantity: { $gte: p.quantity } },
                    { $inc: { availableQuantity: -p.quantity } },
                    { session, new: true }
                );

                if (!updatedProduct) {
                    throw new Error(`Stock conflict for ${p.name}. Please try again.`);
                }
            }

            // Notify farmer (Notifications can be outside or inside transaction, depending on preference)
            const notif = await Notification.create([{
                user: group.farmerId,
                title: 'New Order Received! 🛒',
                message: `You have a new order #${order.orderId} worth ₹${totalAmount}`,
                type: 'order',
                metadata: { orderId: order._id }
            }], { session });

            createdOrders.push(order);
            console.log(`📦 [OrderFlow] Created order #${order.orderId} for farmer: ${group.farmerId}`);
        }

        console.log(`💾 [OrderFlow] Committing transaction for ${createdOrders.length} orders...`);
        await session.commitTransaction();
        session.endSession();
        console.log('✅ [OrderFlow] Transaction committed successfully');

        // Send real-time notifications AFTER commit
        const io = req.app.get('io');
        if (io) {
            createdOrders.forEach(async (order) => {
                const notif = await Notification.findOne({ 'metadata.orderId': order._id });
                if (notif) {
                    io.to(order.farmer.toString()).emit('receive-notification', notif);
                }
            });
        }

        res.status(201).json({
            success: true,
            message: `${createdOrders.length} order(s) placed successfully!`,
            data: createdOrders
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('createOrder error:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to place order' });
    }
};

/**
 * @desc    Get all orders for the authenticated farmer
 * @route   GET /api/farmers/orders
 * @access  Private (Farmer)
 */
export const getFarmerOrders = async (req, res) => {
    try {
        const { status } = req.query;
        let query = { farmer: req.user.id };

        if (status && status !== 'all') {
            query.status = status;
        }

        const orders = await Order.find(query)
            .populate('buyer', 'fullName mobile profilePhoto')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.error('getFarmerOrders error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch orders' });
    }
};

/**
 * @desc    Get single order details
 * @route   GET /api/farmers/orders/:id
 * @access  Private (Farmer)
 */
export const getOrderDetails = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            farmer: req.user.id
        }).populate('buyer', 'fullName mobile email profilePhoto');

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('getOrderDetails error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch order details' });
    }
};

/**
 * @desc    Update order status
 * @route   PUT /api/farmers/orders/:id/status
 * @access  Private (Farmer)
 */
export const updateOrderStatus = async (req, res) => {
    try {
        const { status, notes } = req.body;
        const validStatuses = ['confirmed', 'processing', 'ready_for_pickup', 'cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status update' });
        }

        const order = await Order.findOne({
            _id: req.params.id,
            farmer: req.user.id
        });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Add logic to prevent invalid transitions if needed
        // For example, can't confirm a cancelled order

        order.status = status;
        if (notes) order.notes = notes;

        // If status is ready_for_pickup, generate a 4-digit OTP
        if (status === 'ready_for_pickup') {
            order.products.forEach(p => p.status = 'packed');

            // Generate a 4-digit numeric OTP
            const otp = Math.floor(1000 + Math.random() * 9000).toString();
            order.logistics.deliveryOtp = otp;
        }

        await order.save();

        // Notify Buyer (simplified notification for now)
        const notif = await Notification.create({
            user: order.buyer,
            title: `Order Update: ${status.replace(/_/g, ' ')}`,
            message: `Your order #${order.orderId} has been marked as ${status.replace(/_/g, ' ')}.`,
            type: 'order_update',
            metadata: { orderId: order._id }
        });

        // Emit real-time socket notification to buyer
        const io = req.app.get('io');
        if (io) {
            io.to(order.buyer.toString()).emit('receive-notification', notif);
            io.to(order.buyer.toString()).emit('order-status-updated', {
                orderId: order._id,
                orderCode: order.orderId,
                status: order.status,
                updatedAt: new Date()
            });
        }

        res.status(200).json({
            success: true,
            message: `Order status updated to ${status}`,
            data: order
        });
    } catch (error) {
        console.error('updateOrderStatus error:', error);
        res.status(500).json({ success: false, message: 'Failed to update order status' });
    }
};

/**
 * @desc    Verify delivery OTP and complete order
 * @route   PUT /api/farmers/orders/:id/verify-delivery
 * @access  Private (Farmer)
 */
export const verifyDeliveryOtp = async (req, res) => {
    try {
        const { otp } = req.body;

        const order = await Order.findOne({
            _id: req.params.id,
            farmer: req.user.id
        }).select('+logistics.deliveryOtp');

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (order.status !== 'ready_for_pickup' && order.status !== 'in_transit') {
            return res.status(400).json({ success: false, message: 'Order is not in a deliverable state' });
        }

        if (order.logistics.deliveryOtp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid delivery OTP' });
        }

        // Mark as delivered
        order.status = 'delivered';
        order.logistics.actualDelivery = new Date();
        order.payment.status = 'paid'; // Assumes delivery confirms payment if COD, or finalizes if online
        order.payment.paidAt = new Date();

        // Clear OTP
        order.logistics.deliveryOtp = undefined;

        await order.save();

        // Notify Buyer
        const notif = await Notification.create({
            user: order.buyer,
            title: 'Order Delivered! 📦',
            message: `Your order #${order.orderId} has been successfully delivered.`,
            type: 'order_update',
            metadata: { orderId: order._id }
        });

        // Emit real-time socket notification
        const io = req.app.get('io');
        if (io) {
            io.to(order.buyer.toString()).emit('receive-notification', notif);
            io.to(order.buyer.toString()).emit('order-status-updated', {
                orderId: order._id,
                orderCode: order.orderId,
                status: 'delivered',
                updatedAt: new Date()
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order delivered successfully',
            data: order
        });

    } catch (error) {
        console.error('verifyDeliveryOtp error:', error);
        res.status(500).json({ success: false, message: 'Verification failed', error: error.message });
    }
};

/**
 * @desc    Get all orders (purchases) for the authenticated buyer (Vendor)
 * @route   GET /api/vendors/orders
 * @access  Private (Vendor)
 */
export const getVendorOrders = async (req, res) => {
    try {
        const { status } = req.query;
        let query = { buyer: req.user.id };

        if (status && status !== 'all' && status !== 'All') {
            query.status = status.toLowerCase(); // Ensure lowercase matching if DB is lowercase
        }

        const orders = await Order.find(query)
            .populate('farmer', 'fullName farmName mobile profilePhoto')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.error('getVendorOrders error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch vendor orders' });
    }
};

/**
 * @desc    Get single order details for Vendor
 * @route   GET /api/vendors/orders/:id
 * @access  Private (Vendor)
 */
export const getVendorOrder = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, buyer: req.user.id })
            .populate('farmer', 'fullName farmName mobile profilePhoto email address')
            .populate('products.product', 'name category unit price image');

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('getVendorOrder error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch order details' });
    }
};

// @desc    Cancel order by buyer (Vendor)
// @route   PUT /api/vendors/orders/:id/cancel
// @access  Private (Vendor)
export const cancelOrder = async (req, res) => {
    try {
        const { reason } = req.body;

        const order = await Order.findOne({
            _id: req.params.id,
            buyer: req.user.id
        });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (!['pending'].includes(order.status)) {
            return res.status(400).json({ success: false, message: `Cannot cancel a ${order.status} order` });
        }

        // Return inventory
        for (const item of order.products) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { availableQuantity: item.quantity }
            });
            item.status = 'cancelled';
        }

        order.status = 'cancelled';
        order.cancellation = {
            reason: reason || 'Cancelled by buyer',
            initiatedBy: 'vendor',
            cancelledAt: new Date()
        };

        if (order.payment.method !== 'cod' && order.payment.status === 'paid') {
            order.payment.status = 'refunded';
            order.payment.refundedAt = new Date();
        }

        await order.save();

        // Notify Farmer
        const notif = await Notification.create({
            user: order.farmer,
            title: `Order Cancelled ❌`,
            message: `Order #${order.orderId} was cancelled by the buyer.`,
            type: 'order_update',
            metadata: { orderId: order._id }
        });

        // Emit socket block
        const io = req.app.get('io');
        if (io) {
            io.to(order.farmer.toString()).emit('receive-notification', notif);
            // Also notify farmer's order view
            io.to(order.farmer.toString()).emit('order-status-updated', {
                orderId: order._id,
                orderCode: order.orderId,
                status: 'cancelled',
                updatedAt: new Date()
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully',
            data: order
        });
    } catch (error) {
        console.error('cancelOrder error:', error);
        res.status(500).json({ success: false, message: 'Failed to cancel order' });
    }
};

// @desc    Add review for a delivered order
// @route   PUT /api/vendors/orders/:id/review
// @access  Private (Vendor)
export const addOrderReview = async (req, res) => {
    try {
        const { rating, reviewText } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: 'Please provide a valid rating (1-5)' });
        }

        const order = await Order.findOne({
            _id: req.params.id,
            buyer: req.user.id
        });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (order.status !== 'delivered') {
            return res.status(400).json({ success: false, message: 'Can only review delivered orders' });
        }

        if (order.rating) {
            return res.status(400).json({ success: false, message: 'Order already reviewed' });
        }

        order.rating = rating;
        if (reviewText) {
            order.review = {
                text: reviewText,
                createdAt: new Date()
            };
        }
        await order.save();

        // Update Farmer Rating
        const Farmer = (await import('../models/Farmer.js')).default;
        const farmer = await Farmer.findOne({ user: order.farmer });
        if (farmer) {
            const allRatedOrders = await Order.find({
                farmer: order.farmer,
                rating: { $exists: true, $ne: null }
            });
            const totalRating = allRatedOrders.reduce((sum, o) => sum + o.rating, 0);
            farmer.averageRating = Number((totalRating / allRatedOrders.length).toFixed(1));
            await farmer.save();
        }

        res.status(200).json({
            success: true,
            message: 'Review submitted successfully',
            data: order
        });
    } catch (error) {
        console.error('addOrderReview error:', error);
        res.status(500).json({ success: false, message: 'Failed to submit review' });
    }
};

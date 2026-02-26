import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Notification from '../models/Notification.js';

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

        // If status is ready_for_pickup, update individual product statuses too
        if (status === 'ready_for_pickup') {
            order.products.forEach(p => p.status = 'packed');
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

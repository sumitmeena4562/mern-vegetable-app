import Transaction from '../models/Transaction.js';
import Farmer from '../models/Farmer.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

/**
 * @desc    Get wallet stats for the authenticated farmer
 * @route   GET /api/farmers/wallet/stats
 * @access  Private (Farmer)
 */
export const getWalletStats = async (req, res) => {
    try {
        const farmer = await Farmer.findOne({ user: req.user.id });

        if (!farmer) {
            return res.status(404).json({ message: 'Farmer profile not found' });
        }

        res.status(200).json({
            success: true,
            data: {
                balance: farmer.walletBalance || 0,
                pendingPayouts: farmer.pendingPayouts || 0,
                totalEarned: farmer.totalSales || 0
            }
        });
    } catch (error) {
        console.error('getWalletStats error:', error);
        res.status(500).json({ message: 'Failed to fetch wallet stats' });
    }
};

/**
 * @desc    Get transaction history for the authenticated farmer
 * @route   GET /api/farmers/wallet/transactions
 * @access  Private (Farmer)
 */
export const getTransactionHistory = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json({
            success: true,
            data: transactions
        });
    } catch (error) {
        console.error('getTransactionHistory error:', error);
        res.status(500).json({ message: 'Failed to fetch transaction history' });
    }
};

/**
 * @desc    Request a withdrawal (payout)
 * @route   POST /api/farmers/wallet/withdraw
 * @access  Private (Farmer)
 */
export const requestWithdrawal = async (req, res) => {
    try {
        const { amount, paymentMethod, bankDetails } = req.body;

        const farmer = await Farmer.findOne({ user: req.user.id });

        if (!farmer) {
            return res.status(404).json({ message: 'Farmer profile not found' });
        }

        if (amount <= 0) {
            return res.status(400).json({ message: 'Invalid withdrawal amount' });
        }

        if (farmer.walletBalance < amount) {
            return res.status(400).json({ message: 'Insufficient wallet balance' });
        }

        // Create a transaction record
        const transaction = await Transaction.create({
            user: req.user.id,
            type: 'payout',
            amount,
            status: 'pending',
            paymentMethod: paymentMethod || 'bank_transfer',
            description: 'Withdrawal request',
            balanceAfter: farmer.walletBalance - amount,
            payout: {
                bankDetails: bankDetails || farmer.bankDetails
            }
        });

        // Update farmer balance
        farmer.walletBalance -= amount;
        farmer.pendingPayouts += amount;
        await farmer.save();

        res.status(200).json({
            success: true,
            message: 'Withdrawal request submitted successfully',
            data: transaction
        });
    } catch (error) {
        console.error('requestWithdrawal error:', error);
        res.status(500).json({ message: 'Failed to process withdrawal request' });
    }
};

/**
 * @desc    Get wallet stats for the authenticated vendor
 * @route   GET /api/vendors/wallet/stats
 * @access  Private (Vendor)
 */
export const getVendorWalletStats = async (req, res) => {
    try {
        const vendor = await mongoose.model('Vendor').findOne({ user: req.user.id });

        if (!vendor) {
            return res.status(404).json({ message: 'Vendor profile not found' });
        }

        res.status(200).json({
            success: true,
            data: {
                balance: vendor.walletBalance || 0,
                creditLimit: vendor.creditLimit || 0,
                creditUsed: vendor.currentCreditUsed || 0
            }
        });
    } catch (error) {
        console.error('getVendorWalletStats error:', error);
        res.status(500).json({ message: 'Failed to fetch vendor wallet stats' });
    }
};

/**
 * @desc    Get transaction history for the authenticated vendor
 * @route   GET /api/vendors/wallet/transactions
 * @access  Private (Vendor)
 */
export const getVendorTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json({
            success: true,
            data: transactions
        });
    } catch (error) {
        console.error('getVendorTransactions error:', error);
        res.status(500).json({ message: 'Failed to fetch vendor transactions' });
    }
};

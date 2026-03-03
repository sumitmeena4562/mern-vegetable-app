import Product from '../models/Product.js';
import mongoose from 'mongoose';

/**
 * @desc    Get market price trends for categories
 * @route   GET /api/vendors/market-trends
 * @access  Private (Vendor)
 */
export const getMarketTrends = async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Aggregate to find average price and min price per category in last 7 days
        const trends = await Product.aggregate([
            {
                $match: {
                    createdAt: { $gte: sevenDaysAgo },
                    status: 'available'
                }
            },
            {
                $group: {
                    _id: { category: '$category', variety: '$variety' },
                    avgPrice: { $avg: '$pricePerUnit' },
                    minPrice: { $min: '$pricePerUnit' },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    category: '$_id.category',
                    variety: '$_id.variety',
                    avgPrice: { $round: ['$avgPrice', 2] },
                    minPrice: 1,
                    count: 1,
                    _id: 0
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: trends
        });
    } catch (error) {
        console.error('getMarketTrends error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch trends' });
    }
};

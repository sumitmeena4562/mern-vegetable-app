import mongoose from 'mongoose';
import Product from './models/Product.js';

const run = async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/agriconnect');
    const p = await Product.findOne({});
    if (!p) return console.log('No product found');
    console.log('Found:', p.name, 'Q:', p.quantity, 'SQ:', p.soldQuantity);

    try {
        const res = await Product.findOneAndUpdate(
            {
                _id: p._id,
                $expr: { $gte: [{ $subtract: ["$quantity", "$soldQuantity"] }, 1] }
            },
            { $inc: { soldQuantity: 1 } },
            { new: true }
        );
        console.log('Result:', res ? 'Success' : 'Failed - findOneAndUpdate returned null');
        if (res) console.log('New SQ:', res.soldQuantity);
    } catch (e) {
        console.error('Error:', e.message);
    }
    process.exit();
};
run();

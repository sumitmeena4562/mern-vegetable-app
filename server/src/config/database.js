import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/agriconnect';
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 2000;

let connected = false;

mongoose.set('strictQuery', false);
if (process.env.MONGODB_DEBUG === 'true') mongoose.set('debug', true);

const connectDB = async (retries = 0) => {
  if (connected) return;
  try {
    // Do not pass removed/unsupported options (Mongoose v7+)
    await mongoose.connect(MONGO_URI, {
      // keep an explicit short server selection timeout so failures surface quickly
      serverSelectionTimeoutMS: 5000
    });

    connected = true;
    const { host, port, name } = mongoose.connection;
    console.log(`✅ MongoDB connected: ${host}:${port}/${name}`);
    mongoose.connection.on('disconnected', () => {
      connected = false;
      console.warn('⚠️ MongoDB disconnected');
    });
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
  } catch (err) {
    const attempt = retries + 1;
    console.error(`❌ MongoDB connection error (attempt ${attempt}): ${err?.message || err}`);

    if (retries < MAX_RETRIES) {
      await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
      return connectDB(retries + 1);
    }
    // final failure — rethrow so caller can decide (or process can exit)
    throw err;
  }
};

const disconnectDB = async () => {
  if (!connected) return;
  await mongoose.disconnect();
  connected = false;
  console.info('MongoDB connection closed');
};

export default connectDB;
export { disconnectDB };
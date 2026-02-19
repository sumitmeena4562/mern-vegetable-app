import express from 'express';
import dotenv from 'dotenv';

// Load environment variables immediately
dotenv.config();

import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import fs from 'fs';
import path from 'path';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import Routes
import UserRoutes from "./src/routes/UserRoutes.js";
import farmerRoutes from './src/routes/farmerRoutes.js';
import vendorRoutes from './src/routes/vendorRoutes.js';
import customerRoutes from './src/routes/customerRoutes.js';
import notificationRoutes from './src/routes/NotificationRoutes.js';
import locationRoutes from './src/routes/locationRoutes.js';

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files
app.use('/uploads', express.static(uploadsDir));

// ====================================================
// 1. CONFIGURATION & MIDDLEWARE (ORDER IS IMPORTANT)
// ====================================================

// Frontend URL normalize karo
const FRONTEND_URL = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/+$/, '');

// Trust Proxy (Required for Rate Limiting behind proxies like Ngrok/Heroku/Vercel)
app.set('trust proxy', 1);

// 1. HELMET & MORGAN (Security & Logs)
app.use(helmet());
app.use(morgan('dev'));

// 2. CORS (Sabse Important - Routes se pehle aana chahiye)
// ✅ SECURITY FIX: Whitelist specific domains instead of allowing all
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
  // Add your production domain here
  // 'https://yourdomain.com'
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: function (origin, callback) {
    // 1. Allow if no origin (Postman/Mobile)
    if (!origin) return callback(null, true);

    // 2. Allow everything in Development for Easy Ngrok/Tunnel testing
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    // 3. Whitelist check for Production
    const isNgrok = origin.includes('.ngrok-free.app') || origin.includes('.ngrok.io');
    if (allowedOrigins.indexOf(origin) !== -1 || isNgrok) {
      callback(null, true);
    } else {
      console.error(`❌ CORS BLOCKED: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));


// 3. BODY PARSERS (JSON & URL Encoded)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3.5. INPUT SANITIZATION (Security)
// app.use(mongoSanitize()); // Simplified usage if needed later

// 4. CUSTOM LOGGING (Body parse hone ke baad)
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.originalUrl} - From: ${req.get('origin') || 'Direct'}`);
  if (req.method === 'POST') {
    console.log('📦 Request Body:', req.body);
  }
  next();
});

// ====================================================
// 1.5. RATE LIMITING (Security)
// ====================================================

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes ka time window
  max: 100, // Har IP se max 100 requests allow hongi 15 min mein
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply to all /api routes
app.use('/api', apiLimiter);

// Auth routes ke liye extra strict limit (Recommended for production)
// ✅ SECURITY FIX: Reduced from 500 to 20 to prevent brute force attacks
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: process.env.NODE_ENV === 'production' ? 20 : 100, // Strict in production, relaxed in dev
  message: {
    status: 'error',
    message: 'Too many authentication attempts. Please try again after an hour.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/auth', authLimiter);




// ====================================================
// 2. DATABASE & MODELS
// ====================================================

import connectDB from './src/config/database.js';
import User from './src/models/User.js';
import './src/models/Farmer.js';
import './src/models/Vendor.js';
import './src/models/Customer.js';

console.log("🔍 Checking discriminators...");
console.log("User model discriminators:", User.discriminators);

// Connect to Database
connectDB();

// 3. ROUTES
// ====================================================

// Mount Routes
app.use("/api/auth", UserRoutes);
app.use("/api/farmers", farmerRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/locations", locationRoutes);

// Other Routes (Products, Orders, Market - keeping dynamic loading for them if they exist, or manual if preferred)
// For now, let's keep the core role routes explicit as requested.

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Farm2Vendor API is running',
    timestamp: new Date().toISOString()
  });
});

// ====================================================
// 4. ERROR HANDLING
// ====================================================

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error('❌ Error:', err.message);
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// ====================================================
// 5. SERVER & SOCKET.IO START
// ====================================================

const server = http.createServer(app);
const io = new SocketIO(server, {
  cors: {
    origin: process.env.NODE_ENV === 'development' ? true : [FRONTEND_URL, 'http://localhost:5173'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});


io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  // 🟢 1. User Joined - Set Online
  socket.on('join-user', async (userId) => {
    socket.join(userId);
    console.log(`User ${userId} came Online`);

    // DB Update: isOnline = true
    try {
      await User.findByIdAndUpdate(userId, { isOnline: true });
      io.emit('user-status-change', { userId, isOnline: true }); // Broadcast to others
    } catch (e) {
      console.error("Online update failed:", e);
    }
  });

  // 🔴 2. Manual Offline Toggle
  socket.on('set-status', async ({ userId, status }) => {
    // status: 'online' | 'offline' | 'busy'
    const isOnline = status === 'online';
    await User.findByIdAndUpdate(userId, { isOnline });
    io.emit('user-status-change', { userId, isOnline });
  });
  // 🔌 3. Disconnect - Set Offline
  socket.on('disconnect', async () => {
    console.log('Client disconnected:', socket.id);
    // Note: Use a map to track socketId -> userId if needed for reliable disconnect implementation
    // For simple version, rely on client "set-status" or heartbeat
  });
});


app.set('io', io);

const PORT = parseInt(process.env.PORT, 10) || 5000;

const startServer = (port, attempts = 0, maxAttempts = 5) => {
  server.once('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${port} is already in use.`);
      if (attempts < maxAttempts) {
        const nextPort = port + 1;
        console.log(`➡️  Trying port ${nextPort} (attempt ${attempts + 1})`);
        setTimeout(() => startServer(nextPort, attempts + 1, maxAttempts), 500);
      } else {
        console.error('🚫 Max port attempts reached. Exiting.');
        process.exit(1);
      }
    } else {
      console.error('❌ Server error:', err);
      process.exit(1);
    }
  });

  server.once('listening', () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`🔗 API Base URL: http://localhost:${port}/api`);
  });

  server.listen(port);
};

startServer(PORT);

process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err?.message || err}`);
  server.close(() => process.exit(1));
});
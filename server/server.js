import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import UserRoutes from "./src/routes/UserRoutes.js";

// Load environment variables
dotenv.config();
const app = express();

// ====================================================
// 1. CONFIGURATION & MIDDLEWARE (ORDER IS IMPORTANT)
// ====================================================

// Frontend URL normalize karo
const FRONTEND_URL = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/+$/, '');

// 1. HELMET & MORGAN (Security & Logs)
app.use(helmet());
app.use(morgan('dev'));

// 2. CORS (Sabse Important - Routes se pehle aana chahiye)
app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:5173'], // Array use kiya taaki env fail hone par bhi localhost chale
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// 3. BODY PARSERS (JSON & URL Encoded)
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// 4. CUSTOM LOGGING (Body parse hone ke baad)
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.originalUrl} - From: ${req.get('origin') || 'Direct'}`);
  if (req.method === 'POST') {
    console.log('📦 Request Body:', req.body);
  }
  next();
});

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

// ====================================================
// 3. ROUTES
// ====================================================

// Static Routes (Ab ye CORS ke baad hain, toh error nahi aayega)
app.use("/api/auth", UserRoutes);

// Dynamic Route Loading
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const routesDir = path.join(__dirname, 'src', 'routes');

const routeMap = {
  'auth.js': '/api/auth',
  'farmers.js': '/api/farmers',
  'product.js': '/api/products',
  'vendor.js': '/api/vendors',
  'customer.js': '/api/customers',
  'order.js': '/api/orders',
  'market.js': '/api/market'
};

// Async IIFE to handle await inside loop safely
(async () => {
  for (const [file, mount] of Object.entries(routeMap)) {
    const full = path.join(routesDir, file);
    if (fs.existsSync(full)) {
      try {
        const mod = await import(`./src/routes/${file}`);
        app.use(mount, mod.default || mod);
        console.log(`Loaded route: ${file} -> ${mount}`);
      } catch (error) {
        console.error(`Failed to load route ${file}:`, error);
      }
    } else {
      console.warn(`Skipping missing route file: ${file}`);
    }
  }
})();

// Health check endpoint
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
    origin: [FRONTEND_URL, 'http://localhost:5173'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  socket.on('join-user', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });
  
  socket.on('send-notification', (data) => {
    io.to(data.userId).emit('receive-notification', data);
  });
  
  socket.on('market-update', (data) => {
    io.emit('market-price-update', data);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
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
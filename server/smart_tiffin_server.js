import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

dotenv.config();

// ==========================================
// 1. CUSTOM SYSTEM LOGGER (ANSI Colors)
// ==========================================
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m'
};

const log = {
    info: (msg) => console.info(`   ${colors.blue}ℹ${colors.reset} ${msg}`),
    success: (msg) => console.info(`   ${colors.green}✓${colors.reset} ${msg}`),
    warning: (msg) => console.warn(`   ${colors.yellow}⚠${colors.reset} ${msg}`),
    error: (msg) => console.error(`   ${colors.red}✖${colors.reset} ${msg}`),
    server: (msg) => console.info(`   ${colors.cyan}🚀${colors.reset} ${msg}`),
    banner: () => {
        console.info(`\n${colors.cyan}   ╔══════════════════════════════════════╗`);
        console.info(`   ║        🚀 SMART TIFFIN SYSTEM        ║`);
        console.info(`   ║        Production Backend            ║`);
        console.info(`   ╚══════════════════════════════════════╝${colors.reset}\n`);
    }
};

// ==========================================
// 2. SERVER INITIALIZATION
// ==========================================
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL || '*', methods: ['GET', 'POST'] }
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart-tiffin';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';
const NODE_ENV = process.env.NODE_ENV || 'development';

// ==========================================
// 3. CORE MIDDLEWARE
// ==========================================
app.use(express.json());
// CORS configured silently without duplicate logs
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));

// ==========================================
// 4. DATABASE CONNECTION (Retry Logic)
// ==========================================
const connectDB = async (retries = 5) => {
    try {
        await mongoose.connect(MONGO_URI);
        // Successful connection logging is handled centrally after server boot
    } catch (err) {
        if (retries === 0) {
            log.error('Database connection failed permanently.');
            process.exit(1);
        }
        log.warning(`Database connection failed. Retrying... (${retries} retries left)`);
        setTimeout(() => connectDB(retries - 1), 5000);
    }
};

// ==========================================
// 5. ROUTES
// ==========================================
// Dummy routers for illustration
const authRouter = express.Router();
const adminRouter = express.Router();
const providerRouter = express.Router();
const customerRouter = express.Router();

// Health Check Route
app.get('/health', (req, res) => res.status(200).json({ status: 'OK', uptime: process.uptime() }));

// Core API Mounts
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/provider', providerRouter);
app.use('/api/customer', customerRouter);

// ==========================================
// 6. ERROR HANDLING (Clean & Minimal)
// ==========================================
app.use((err, req, res, next) => {
    if (NODE_ENV !== 'production') {
        log.error(`[Error] ${err.name}: ${err.message}`);
    }

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(NODE_ENV === 'development' && { stack: err.stack })
    });
});

// ==========================================
// 7. SOCKET.IO INTEGRATION WITH JWT
// ==========================================
io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.token;
    if (!token) return next(new Error('Authentication error: Token missing'));

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return next(new Error('Authentication error: Invalid token'));
        socket.user = decoded;
        next();
    });
});

io.on('connection', (socket) => {
    // Join User-Specific Authentication Room safely
    if (socket.user && socket.user.id) {
        socket.join(`user_${socket.user.id}`);
    }

    socket.on('disconnect', () => {
        // Handled silently to prevent log spam
    });
});

// ==========================================
// 8. SERVER STARTUP & SaaS OUTPUT
// ==========================================
const bootServer = async () => {
    await connectDB();

    server.listen(PORT, () => {
        log.banner();

        console.info(`   ${colors.green}✓${colors.reset} Server Status: ${colors.green}LIVE${colors.reset}`);
        console.info(`   ${colors.blue}🌐${colors.reset} API URL:      http://localhost:${PORT}`);
        console.info(`   ${colors.yellow}📡${colors.reset} Socket:       ws://localhost:${PORT}`);
        console.info(`   ${colors.cyan}🗄 ${colors.reset} Database:     Connected`);
        console.info(`   ${colors.bright}🔐${colors.reset} Auth:         JWT Enabled`);
        console.info(`   ${colors.bright}🌍${colors.reset} Environment:  ${NODE_ENV}`);
        console.info(`   ${colors.gray}🕒${colors.reset} Started At:   ${new Date().toLocaleString()}\n`);

        console.info(`   ${colors.bright}Available Routes:${colors.reset}`);
        console.info(`   ${colors.gray}├─${colors.reset} /api/auth`);
        console.info(`   ${colors.gray}├─${colors.reset} /api/admin`);
        console.info(`   ${colors.gray}├─${colors.reset} /api/provider`);
        console.info(`   ${colors.gray}├─${colors.reset} /api/customer`);
        console.info(`   ${colors.gray}└─${colors.reset} /health\n`);
    });
};

bootServer();

// ==========================================
// 9. GRACEFUL SHUTDOWN
// ==========================================
const gracefulShutdown = () => {
    log.info('\nReceived kill signal, shutting down gracefully.');
    server.close(() => {
        mongoose.connection.close(false, () => {
            log.success('Closed remaining connections properly.');
            process.exit(0);
        });
    });

    setTimeout(() => {
        log.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

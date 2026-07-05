import express from 'express';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { globalErrorHandler } from './Middlewares/error.middleware.js';
import authRoutes from './Modules/Auth/Routes/auth.routes.js';
import profileRoutes from './Modules/Auth/Routes/profile.routes.js';
import cookie from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import profileDiscoverRouter from './Modules/Discover/Routes/profileDiscoveryRoutes.routes.js';
import matchRouter from './Modules/Match/Routes/match.routes.js';
import projectRouter from './Modules/Projects/Routes/Project.routes.js';
import applicationRouter from './Modules/Projects/Routes/Application.routes.js';
import memberRouter from './Modules/Projects/Routes/Member.routes.js';
import bookmarkRouter from './Modules/Projects/Routes/Bookmark.routes.js';
import invitationRouter from './Modules/Projects/Routes/Invitation.routes.js';
import messageRouter from './Modules/Messages/Routes/message.routes.js';

const App = express();

// ─── CORS (must come BEFORE helmet and rate-limiter) ───────────────────────
const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
];

const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        // Allow non-browser requests (e.g. Postman, mobile) and listed origins
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS: Origin ${origin} is not allowed`));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

App.use(cors(corsOptions));

// Handle OPTIONS preflight for ALL routes (Express 5 requires named wildcard)
App.options('/{*path}', cors(corsOptions));

// ─── Security Hardening ────────────────────────────────────────────────────
App.use(
    helmet({
        // Allow cross-origin requests – required so the frontend can call this API
        crossOriginResourcePolicy: { policy: 'cross-origin' },
        crossOriginOpenerPolicy: { policy: 'unsafe-none' },
    })
);

// ─── Rate Limiters ─────────────────────────────────────────────────────────
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 500, // raised from 150 to reduce false positives in dev
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { success: false, error: 'Too many requests, please try again later' },
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { success: false, error: 'Too many authentication attempts, please try again later' },
});

App.use(globalLimiter);

// ─── Body Parsing & Logging ────────────────────────────────────────────────
App.use(morgan('dev'));
App.use(express.json({ limit: '10mb' }));
App.use(express.urlencoded({ extended: true, limit: '10mb' }));
App.use(cookie());

// ─── Routes ────────────────────────────────────────────────────────────────
App.use('/api/v1/auth', authLimiter, authRoutes);
App.use('/api/v1/profile', profileRoutes);
App.use('/api/v1/discover/profile', profileDiscoverRouter);
App.use('/api/v1/match', matchRouter);
App.use('/api/v1/project', projectRouter);
App.use('/api/v1/project', applicationRouter);
App.use('/api/v1/applications', applicationRouter);
App.use('/api/v1/project', memberRouter);
App.use('/api/v1/project', bookmarkRouter);
App.use('/api/v1/bookmarks', bookmarkRouter);
App.use('/api/v1/project', invitationRouter);
App.use('/api/v1/invitations', invitationRouter);
App.use('/api/v1/messages', messageRouter);

// ─── Health Check ──────────────────────────────────────────────────────────
App.get('/health', (_req, res) => {
    res.status(200).json({ success: true, message: 'peerY API is running' });
});

// ─── Global Error Handler ──────────────────────────────────────────────────
App.use(globalErrorHandler);

export default App;

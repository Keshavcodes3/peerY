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

const App = express();

// Security Hardening
App.use(helmet());

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 150, // Limit each IP to 150 requests per window
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { success: false, error: "Too many requests, please try again later" }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 30, // Limit each IP to 30 requests per window
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { success: false, error: "Too many authentication attempts, please try again later" }
});

App.use(globalLimiter);

App.use(morgan("dev"));
App.use(express.json());
App.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));
App.use(cookie());

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

App.use(globalErrorHandler);

export default App;

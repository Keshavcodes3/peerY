import express from 'express';
import { globalErrorHandler } from './Middlewares/error.middleware.js';
import authRoutes from './Modules/Auth/Routes/auth.routes.js';
import profileRoutes from './Modules/Auth/Routes/profile.routes.js';
import cookie from 'cookie-parser'
import cors from 'cors'
import morgan from 'morgan'
import profileDiscoverRouter from './Modules/Discover/Routes/profileDiscoveryRoutes.routes.js';
import matchRouter from './Modules/Match/Routes/match.routes.js';
import projectRouter from './Modules/Projects/Routes/Project.routes.js';
import applicationRouter from './Modules/Projects/Routes/Application.routes.js';
import memberRouter from './Modules/Projects/Routes/Member.routes.js';

const App = express()
App.use(morgan("dev"))
App.use(express.json())
App.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}))
App.use(cookie())

App.use('/api/v1/auth', authRoutes);
App.use('/api/v1/profile', profileRoutes);
App.use('/api/v1/discover/profile', profileDiscoverRouter)
App.use('/api/v1/match', matchRouter)
App.use('/api/v1/project', projectRouter)
App.use('/api/v1/project', applicationRouter)
App.use('/api/v1/applications', applicationRouter)
App.use('/api/v1/project', memberRouter)


App.use(globalErrorHandler);

export default App

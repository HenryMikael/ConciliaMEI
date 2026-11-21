import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import healthRoutes from './routes/health.routes.js';

const app = express();

const allowedOrigins = (
    process.env.NODE_ENV || "http://localhost:5173"
).split(',');

// Security and middleware configuration
app.use(helmet());
app.use(cors({
    origin: allowedOrigins,
}));

app.use(express.json({ limit: '1mb'}));

app.use(morgan('dev'));

// API routes
app.use("/api/health", healthRoutes);

export default app;


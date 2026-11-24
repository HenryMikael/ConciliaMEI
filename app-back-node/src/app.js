import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from "cookie-parser";

import healthRoutes from './routes/health.routes.js';
import authRoutes from "./routes/auth.routes.js";
import bankAccountRoutes from "./routes/bank-account.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";

const app = express();

const allowedOrigins = (
    process.env.FRONTEND_URL || "http://localhost:5173"
).split(',');

// Security and middleware configuration
app.use(cookieParser());
app.use(helmet());
app.use(cors({
    origin: allowedOrigins,
}));

app.use(express.json({ limit: '1mb'}));

app.use(morgan('dev'));

// API routes
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bank-accounts", bankAccountRoutes);
app.use("/api/transactions", transactionRoutes);

export default app;


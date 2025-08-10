import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import { pino } from 'pino';

import { healthCheckRouter, openAPIRouter, userRouter } from '@/api';
import { env, errorHandler, rateLimiter, requestLogger } from '@/common';

const logger = pino({ name: 'server start' });
const app: Express = express();

// app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// Routes
app.use('/health-check', healthCheckRouter);
app.use('/users', userRouter);

// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };

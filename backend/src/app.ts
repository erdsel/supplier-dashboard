import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import authRoutes from './routes/authRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
// import importRoutes from './routes/importRoutes';
// import { apiLimiter } from './middleware/rateLimiter';
import logger from './utils/logger';

const app: Application = express();

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Lonca Vendor Dashboard API',
      version: '1.0.0',
      description: 'API for vendor sales analytics dashboard',
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3002',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['src/routes/*.ts', 'src/models/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(helmet());
const corsOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : ['http://localhost:3000'];

app.use(cors({
  origin: corsOrigins,
  credentials: true,
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rate limiting temporarily disabled for debugging

app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);
// app.use('/api/import', importRoutes);

app.get('/healthz', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/metrics', (_req: Request, res: Response) => {
  res.json({
    memory: process.memoryUsage(),
    uptime: process.uptime(),
    pid: process.pid,
    timestamp: new Date().toISOString(),
  });
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err: any, _req: Request, res: Response, _next: any) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
import 'dotenv/config';
import app from './app';
import connectDB from './config/database';
// import dataImportService from './services/dataImportService';
import logger from './utils/logger';

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    await connectDB();
    
    // Import initial data if needed (geçici olarak devre dışı)
    // if (process.env.NODE_ENV !== 'test') {
    //   await dataImportService.importAllData();
    // }
    
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`API Docs available at http://localhost:${PORT}/api-docs`);
      logger.info(`Health check at http://localhost:${PORT}/healthz`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('unhandledRejection', (error: Error) => {
  logger.error('Unhandled Rejection:', error);
  process.exit(1);
});

process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  console.error('Stack trace:', error.stack);
  console.error('Error name:', error.name);
  console.error('Error message:', error.message);
  logger.error('Uncaught Exception:', error);
  logger.error('Stack trace:', error.stack);
  logger.error('Error name:', error.name);
  logger.error('Error message:', error.message);
  process.exit(1);
});

startServer();
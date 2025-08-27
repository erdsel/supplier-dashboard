import { Router } from 'express';
import importController from '../controllers/importController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Import all data (admin only)
router.post('/all', authenticate, authorize('admin'), importController.importAllData);

// Get import status
router.get('/status', authenticate, importController.getImportStatus);

// Public import endpoint (temporary for setup)
router.post('/setup', importController.importAllData);
router.get('/setup/status', importController.getImportStatus);

export default router;
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import analyticsService from '../services/analyticsService';
import logger from '../utils/logger';

export class AnalyticsController {
  async getMonthlySales(req: AuthRequest, res: Response): Promise<void> {
    try {
      const vendorId = req.params.vendorId || req.user?.vendorId;
      
      if (!vendorId) {
        res.status(400).json({ error: 'Vendor ID is required' });
        return;
      }

      if (req.user?.role === 'vendor' && req.user.vendorId !== vendorId) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      const monthlySales = await analyticsService.getMonthlySales(vendorId);
      
      res.json({
        success: true,
        data: monthlySales
      });
    } catch (error) {
      logger.error('Get monthly sales error:', error);
      res.status(500).json({ error: 'Failed to fetch monthly sales' });
    }
  }

  async getProductSales(req: AuthRequest, res: Response): Promise<void> {
    try {
      const vendorId = req.params.vendorId || req.user?.vendorId;
      
      if (!vendorId) {
        res.status(400).json({ error: 'Vendor ID is required' });
        return;
      }

      if (req.user?.role === 'vendor' && req.user.vendorId !== vendorId) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      const productSales = await analyticsService.getProductSales(vendorId);
      
      res.json({
        success: true,
        data: productSales
      });
    } catch (error) {
      logger.error('Get product sales error:', error);
      res.status(500).json({ error: 'Failed to fetch product sales' });
    }
  }

  async getVendorStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      const vendorId = req.params.vendorId || req.user?.vendorId;
      
      if (!vendorId) {
        res.status(400).json({ error: 'Vendor ID is required' });
        return;
      }

      if (req.user?.role === 'vendor' && req.user.vendorId !== vendorId) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      const stats = await analyticsService.getVendorStats(vendorId);
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      logger.error('Get vendor stats error:', error);
      res.status(500).json({ error: 'Failed to fetch vendor statistics' });
    }
  }

  async clearCache(req: AuthRequest, res: Response): Promise<void> {
    try {
      const vendorId = req.params.vendorId || req.user?.vendorId;
      
      if (!vendorId) {
        res.status(400).json({ error: 'Vendor ID is required' });
        return;
      }

      await analyticsService.clearCache(vendorId);
      
      res.json({
        success: true,
        message: 'Cache cleared successfully'
      });
    } catch (error) {
      logger.error('Clear cache error:', error);
      res.status(500).json({ error: 'Failed to clear cache' });
    }
  }

  async getDetailedAnalytics(req: AuthRequest, res: Response): Promise<void> {
    try {
      const vendorId = req.params.vendorId || req.user?.vendorId;
      
      if (!vendorId) {
        res.status(400).json({ error: 'Vendor ID is required' });
        return;
      }

      const analytics = await analyticsService.getDetailedAnalytics(vendorId);
      
      res.json({
        success: true,
        vendorId,
        timestamp: new Date().toISOString(),
        data: analytics
      });
    } catch (error) {
      logger.error('Get detailed analytics error:', error);
      res.status(500).json({ error: 'Failed to fetch detailed analytics' });
    }
  }

  async validateData(req: AuthRequest, res: Response): Promise<void> {
    try {
      const vendorId = req.params.vendorId || req.user?.vendorId;
      
      if (!vendorId) {
        res.status(400).json({ error: 'Vendor ID is required' });
        return;
      }

      const validation = await analyticsService.validateVendorData(vendorId);
      
      res.json({
        success: true,
        vendorId,
        timestamp: new Date().toISOString(),
        validation
      });
    } catch (error) {
      logger.error('Validate data error:', error);
      res.status(500).json({ error: 'Failed to validate data' });
    }
  }

  async getDateRangeAnalytics(req: AuthRequest, res: Response): Promise<void> {
    try {
      const vendorId = req.params.vendorId || req.user?.vendorId;
      const { startDate, endDate } = req.query;
      
      if (!vendorId) {
        res.status(400).json({ error: 'Vendor ID is required' });
        return;
      }

      const analytics = await analyticsService.getDateRangeAnalytics(
        vendorId,
        startDate as string,
        endDate as string
      );
      
      res.json({
        success: true,
        vendorId,
        dateRange: { startDate, endDate },
        data: analytics
      });
    } catch (error) {
      logger.error('Get date range analytics error:', error);
      res.status(500).json({ error: 'Failed to fetch date range analytics' });
    }
  }
}

export default new AnalyticsController();
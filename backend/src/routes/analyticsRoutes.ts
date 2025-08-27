import { Router } from 'express';
import analyticsController from '../controllers/analyticsController';
import { authenticate, authorize } from '../middleware/auth';
import { createCustomLimiter } from '../middleware/rateLimiter';

const router = Router();

const analyticsLimiter = createCustomLimiter(60000, 30);

/**
 * @swagger
 * /api/analytics/monthly-sales/{vendorId}:
 *   get:
 *     tags: [Analytics]
 *     summary: Get monthly sales data
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vendorId
 *         schema:
 *           type: string
 *         description: Vendor ID (optional)
 *     responses:
 *       200:
 *         description: Monthly sales data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                       year:
 *                         type: number
 *                       totalSales:
 *                         type: number
 *                       totalOrders:
 *                         type: number
 *                       totalQuantity:
 *                         type: number
 */
router.get(
  '/monthly-sales/:vendorId?',
  authenticate,
  analyticsLimiter,
  analyticsController.getMonthlySales
);

/**
 * @swagger
 * /api/analytics/product-sales/{vendorId}:
 *   get:
 *     tags: [Analytics]
 *     summary: Get product-based sales data
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vendorId
 *         schema:
 *           type: string
 *         description: Vendor ID (optional)
 *     responses:
 *       200:
 *         description: Product sales data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: string
 *                       productName:
 *                         type: string
 *                       totalQuantity:
 *                         type: number
 *                       totalSales:
 *                         type: number
 *                       totalOrders:
 *                         type: number
 */
router.get(
  '/product-sales/:vendorId?',
  authenticate,
  analyticsLimiter,
  analyticsController.getProductSales
);

/**
 * @swagger
 * /api/analytics/vendor-stats/{vendorId}:
 *   get:
 *     tags: [Analytics]
 *     summary: Get vendor statistics summary
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vendorId
 *         schema:
 *           type: string
 *         description: Vendor ID (optional)
 *     responses:
 *       200:
 *         description: Vendor statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalProducts:
 *                       type: number
 *                     totalRevenue:
 *                       type: string
 *                     totalOrders:
 *                       type: number
 *                     topProduct:
 *                       type: object
 *                     lastUpdated:
 *                       type: string
 */
router.get(
  '/vendor-stats/:vendorId?',
  authenticate,
  analyticsLimiter,
  analyticsController.getVendorStats
);

/**
 * @swagger
 * /api/analytics/cache/{vendorId}:
 *   delete:
 *     tags: [Analytics]
 *     summary: Clear analytics cache (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vendorId
 *         schema:
 *           type: string
 *         description: Vendor ID (optional)
 *     responses:
 *       200:
 *         description: Cache cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.delete(
  '/cache/:vendorId?',
  authenticate,
  authorize('admin'),
  analyticsController.clearCache
);

/**
 * @swagger
 * /api/analytics/detailed/{vendorId}:
 *   get:
 *     tags: [Analytics]
 *     summary: Get detailed analytics for a vendor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vendorId
 *         schema:
 *           type: string
 *         description: Vendor ID (optional, uses authenticated vendor's ID if not provided)
 *     responses:
 *       200:
 *         description: Detailed analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 vendorId:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalRevenue:
 *                       type: string
 *                     totalOrders:
 *                       type: number
 *                     uniqueOrderCount:
 *                       type: number
 *                     totalQuantitySold:
 *                       type: number
 *                     averageOrderValue:
 *                       type: string
 *                     minOrderValue:
 *                       type: string
 *                     maxOrderValue:
 *                       type: string
 *                     firstSaleDate:
 *                       type: string
 *                     lastSaleDate:
 *                       type: string
 *                     uniqueProductsSold:
 *                       type: number
 *                     totalProductsInCatalog:
 *                       type: number
 */
router.get(
  '/detailed/:vendorId?',
  authenticate,
  analyticsLimiter,
  analyticsController.getDetailedAnalytics
);

/**
 * @swagger
 * /api/analytics/validate/{vendorId}:
 *   get:
 *     tags: [Analytics]
 *     summary: Validate vendor data consistency
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vendorId
 *         schema:
 *           type: string
 *         description: Vendor ID (optional, uses authenticated vendor's ID if not provided)
 *     responses:
 *       200:
 *         description: Data validation results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 vendorId:
 *                   type: string
 *                 validation:
 *                   type: object
 *                   properties:
 *                     directCalculation:
 *                       type: object
 *                     cachedData:
 *                       type: object
 *                     monthlyAggregation:
 *                       type: object
 *                     validation:
 *                       type: object
 *                       properties:
 *                         revenueMatch:
 *                           type: boolean
 *                         ordersMatch:
 *                           type: boolean
 *                         discrepancies:
 *                           type: object
 */
router.get(
  '/validate/:vendorId?',
  authenticate,
  analyticsLimiter,
  analyticsController.validateData
);

/**
 * @swagger
 * /api/analytics/date-range/{vendorId}:
 *   get:
 *     tags: [Analytics]
 *     summary: Get analytics for a specific date range
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vendorId
 *         schema:
 *           type: string
 *         description: Vendor ID (optional, uses authenticated vendor's ID if not provided)
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Date range analytics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 vendorId:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     dateRange:
 *                       type: object
 *                     summary:
 *                       type: object
 *                     dailyBreakdown:
 *                       type: array
 */
router.get(
  '/date-range/:vendorId?',
  authenticate,
  analyticsLimiter,
  analyticsController.getDateRangeAnalytics
);

export default router;
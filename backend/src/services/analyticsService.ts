import Order from '../models/Order';
import Product from '../models/Product';
import { Types } from 'mongoose';
import Decimal from 'decimal.js';
import redisClient, { safeRedisOperation } from '../config/redis';
import logger from '../utils/logger';

interface MonthlySales {
  month: string;
  year: number;
  totalSales: number;
  totalOrders: number;
  totalQuantity: number;
}

interface ProductSales {
  productId: string;
  productName: string;
  totalQuantity: number;
  totalSales: number;
  totalOrders: number;
}

export class AnalyticsService {
  private readonly CACHE_TTL = 300;

  async getMonthlySales(vendorId: string): Promise<MonthlySales[]> {
    const cacheKey = `monthly_sales:${vendorId}`;
    
    const cached = await safeRedisOperation(async () => {
      const result = await redisClient.get(cacheKey);
      if (result) {
        logger.debug('Returning cached monthly sales');
        return JSON.parse(result);
      }
      return null;
    });
    
    if (cached) return cached;

    const pipeline: any[] = [
      { $unwind: '$cart_item' },
      {
        $lookup: {
          from: 'parent_products',
          localField: 'cart_item.product',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $match: {
          'product.vendor': new Types.ObjectId(vendorId)
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$payment_at' },
            month: { $month: '$payment_at' }
          },
          totalSales: {
            $sum: {
              $multiply: [
                '$cart_item.price',
                '$cart_item.quantity',
                '$cart_item.item_count'
              ]
            }
          },
          totalOrders: { $sum: 1 },
          totalQuantity: {
            $sum: { $multiply: ['$cart_item.quantity', '$cart_item.item_count'] }
          }
        }
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          monthNum: '$_id.month',
          month: {
            $switch: {
              branches: [
                { case: { $eq: ['$_id.month', 1] }, then: 'Ocak' },
                { case: { $eq: ['$_id.month', 2] }, then: 'Şubat' },
                { case: { $eq: ['$_id.month', 3] }, then: 'Mart' },
                { case: { $eq: ['$_id.month', 4] }, then: 'Nisan' },
                { case: { $eq: ['$_id.month', 5] }, then: 'Mayıs' },
                { case: { $eq: ['$_id.month', 6] }, then: 'Haziran' },
                { case: { $eq: ['$_id.month', 7] }, then: 'Temmuz' },
                { case: { $eq: ['$_id.month', 8] }, then: 'Ağustos' },
                { case: { $eq: ['$_id.month', 9] }, then: 'Eylül' },
                { case: { $eq: ['$_id.month', 10] }, then: 'Ekim' },
                { case: { $eq: ['$_id.month', 11] }, then: 'Kasım' },
                { case: { $eq: ['$_id.month', 12] }, then: 'Aralık' }
              ],
              default: 'Unknown'
            }
          },
          totalSales: { $round: ['$totalSales', 2] },
          totalOrders: 1,
          totalQuantity: 1
        }
      },
      { $sort: { year: -1, monthNum: -1 } }
    ];

    const results = await Order.aggregate(pipeline);

    await safeRedisOperation(async () => {
      await redisClient.setEx(cacheKey, this.CACHE_TTL, JSON.stringify(results));
    });

    return results;
  }

  async getProductSales(vendorId: string): Promise<ProductSales[]> {
    const cacheKey = `product_sales:${vendorId}`;
    
    const cached = await safeRedisOperation(async () => {
      const result = await redisClient.get(cacheKey);
      if (result) {
        logger.debug('Returning cached product sales');
        return JSON.parse(result);
      }
      return null;
    });
    
    if (cached) return cached;

    const pipeline: any[] = [
      { $unwind: '$cart_item' },
      {
        $lookup: {
          from: 'parent_products',
          localField: 'cart_item.product',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $match: {
          'product.vendor': new Types.ObjectId(vendorId)
        }
      },
      {
        $group: {
          _id: '$product._id',
          productName: { $first: '$product.name' },
          totalQuantity: {
            $sum: { $multiply: ['$cart_item.quantity', '$cart_item.item_count'] }
          },
          totalSales: {
            $sum: {
              $multiply: [
                '$cart_item.price',
                '$cart_item.quantity',
                '$cart_item.item_count'
              ]
            }
          },
          totalOrders: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          productId: '$_id',
          productName: 1,
          totalQuantity: 1,
          totalSales: { $round: ['$totalSales', 2] },
          totalOrders: 1
        }
      },
      { $sort: { totalSales: -1 } }
    ];

    const results = await Order.aggregate(pipeline);

    await safeRedisOperation(async () => {
      await redisClient.setEx(cacheKey, this.CACHE_TTL, JSON.stringify(results));
    });

    return results;
  }

  async getVendorStats(vendorId: string) {
    const cacheKey = `vendor_stats:${vendorId}`;
    
    const cached = await safeRedisOperation(async () => {
      const result = await redisClient.get(cacheKey);
      if (result) {
        return JSON.parse(result);
      }
      return null;
    });
    
    if (cached) return cached;

    const [totalProducts, monthlySales, topProducts] = await Promise.all([
      Product.countDocuments({ vendor: vendorId }),
      this.getMonthlySales(vendorId),
      this.getProductSales(vendorId)
    ]);

    const totalRevenue = monthlySales.reduce((sum, month) => 
      new Decimal(sum).plus(month.totalSales).toNumber(), 0
    );

    const stats = {
      totalProducts,
      totalRevenue: new Decimal(totalRevenue).toFixed(2),
      totalOrders: monthlySales.reduce((sum, month) => sum + month.totalOrders, 0),
      topProduct: topProducts[0] || null,
      lastUpdated: new Date()
    };

    try {
      if (redisClient.isOpen) {
        await redisClient.setEx(cacheKey, this.CACHE_TTL, JSON.stringify(stats));
      }
    } catch (error) {
      logger.error('Redis cache set error:', error);
    }

    return stats;
  }

  async clearCache(vendorId: string): Promise<void> {
    const keys = [
      `monthly_sales:${vendorId}`,
      `product_sales:${vendorId}`,
      `vendor_stats:${vendorId}`
    ];

    await safeRedisOperation(async () => {
      await redisClient.del(keys);
      logger.info(`Cleared cache for vendor ${vendorId}`);
    });
  }

  async getDetailedAnalytics(vendorId: string): Promise<any> {
    const pipeline = [
      { $unwind: '$cart_item' },
      {
        $lookup: {
          from: 'parent_products',
          localField: 'cart_item.product',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $match: {
          'product.vendor': new Types.ObjectId(vendorId)
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: {
              $multiply: [
                '$cart_item.price',
                '$cart_item.quantity',
                '$cart_item.item_count'
              ]
            }
          },
          totalOrders: { $sum: 1 },
          uniqueOrders: { $addToSet: '$_id' },
          totalQuantity: {
            $sum: { $multiply: ['$cart_item.quantity', '$cart_item.item_count'] }
          },
          avgOrderValue: { $avg: {
            $multiply: [
              '$cart_item.price',
              '$cart_item.quantity',
              '$cart_item.item_count'
            ]
          }},
          minOrderValue: { $min: {
            $multiply: [
              '$cart_item.price',
              '$cart_item.quantity',
              '$cart_item.item_count'
            ]
          }},
          maxOrderValue: { $max: {
            $multiply: [
              '$cart_item.price',
              '$cart_item.quantity',
              '$cart_item.item_count'
            ]
          }},
          firstOrderDate: { $min: '$payment_at' },
          lastOrderDate: { $max: '$payment_at' },
          uniqueProducts: { $addToSet: '$cart_item.product' }
        }
      }
    ];

    const [result] = await Order.aggregate(pipeline);
    const productCount = await Product.countDocuments({ vendor: vendorId });

    return {
      totalRevenue: result?.totalRevenue ? new Decimal(result.totalRevenue).toFixed(2) : '0.00',
      totalOrders: result?.totalOrders || 0,
      uniqueOrderCount: result?.uniqueOrders?.length || 0,
      totalQuantitySold: result?.totalQuantity || 0,
      averageOrderValue: result?.avgOrderValue ? new Decimal(result.avgOrderValue).toFixed(2) : '0.00',
      minOrderValue: result?.minOrderValue ? new Decimal(result.minOrderValue).toFixed(2) : '0.00',
      maxOrderValue: result?.maxOrderValue ? new Decimal(result.maxOrderValue).toFixed(2) : '0.00',
      firstSaleDate: result?.firstOrderDate || null,
      lastSaleDate: result?.lastOrderDate || null,
      uniqueProductsSold: result?.uniqueProducts?.length || 0,
      totalProductsInCatalog: productCount,
      dateRange: {
        days: result?.firstOrderDate && result?.lastOrderDate 
          ? Math.floor((new Date(result.lastOrderDate).getTime() - new Date(result.firstOrderDate).getTime()) / (1000 * 60 * 60 * 24))
          : 0
      }
    };
  }

  async validateVendorData(vendorId: string): Promise<any> {
    // MongoDB'den direkt hesaplama
    const directCalc = await this.getDetailedAnalytics(vendorId);
    
    // Cache'den veri
    const cachedStats = await this.getVendorStats(vendorId);
    const cachedMonthly = await this.getMonthlySales(vendorId);
    
    // Aylık toplamları hesapla
    const monthlyTotal = cachedMonthly.reduce((sum, month) => 
      new Decimal(sum).plus(month.totalSales).toNumber(), 0
    );
    const monthlyOrders = cachedMonthly.reduce((sum, month) => 
      sum + month.totalOrders, 0
    );

    return {
      directCalculation: directCalc,
      cachedData: {
        totalRevenue: cachedStats.totalRevenue,
        totalOrders: cachedStats.totalOrders,
        totalProducts: cachedStats.totalProducts
      },
      monthlyAggregation: {
        totalRevenue: new Decimal(monthlyTotal).toFixed(2),
        totalOrders: monthlyOrders,
        monthCount: cachedMonthly.length
      },
      validation: {
        revenueMatch: directCalc.totalRevenue === cachedStats.totalRevenue,
        ordersMatch: directCalc.totalOrders === monthlyOrders,
        discrepancies: {
          revenue: new Decimal(directCalc.totalRevenue).minus(cachedStats.totalRevenue).toFixed(2),
          orders: directCalc.totalOrders - monthlyOrders
        }
      }
    };
  }

  async getDateRangeAnalytics(vendorId: string, startDate?: string, endDate?: string): Promise<any> {
    const matchConditions: any = {
      'product.vendor': new Types.ObjectId(vendorId)
    };

    // Tarih filtresi ekle
    const dateFilter: any = {};
    if (startDate) {
      dateFilter.$gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.$lte = new Date(endDate);
    }

    const pipeline: any[] = [
      // Önce tarih filtresini uygula
      ...(Object.keys(dateFilter).length > 0 ? [{
        $match: { payment_at: dateFilter }
      }] : []),
      { $unwind: '$cart_item' },
      {
        $lookup: {
          from: 'parent_products',
          localField: 'cart_item.product',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      { $match: matchConditions },
      {
        $group: {
          _id: {
            year: { $year: '$payment_at' },
            month: { $month: '$payment_at' },
            day: { $dayOfMonth: '$payment_at' }
          },
          dailyRevenue: {
            $sum: {
              $multiply: [
                '$cart_item.price',
                '$cart_item.quantity',
                '$cart_item.item_count'
              ]
            }
          },
          dailyOrders: { $sum: 1 },
          dailyQuantity: {
            $sum: { $multiply: ['$cart_item.quantity', '$cart_item.item_count'] }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ];

    const dailyData = await Order.aggregate(pipeline);

    // Toplam özet
    const totals = dailyData.reduce((acc, day) => ({
      revenue: new Decimal(acc.revenue).plus(day.dailyRevenue).toNumber(),
      orders: acc.orders + day.dailyOrders,
      quantity: acc.quantity + day.dailyQuantity
    }), { revenue: 0, orders: 0, quantity: 0 });

    return {
      dateRange: {
        start: startDate || 'all time',
        end: endDate || 'current'
      },
      summary: {
        totalRevenue: new Decimal(totals.revenue).toFixed(2),
        totalOrders: totals.orders,
        totalQuantity: totals.quantity,
        daysWithSales: dailyData.length
      },
      dailyBreakdown: dailyData.map(d => ({
        date: `${d._id.year}-${String(d._id.month).padStart(2, '0')}-${String(d._id.day).padStart(2, '0')}`,
        revenue: new Decimal(d.dailyRevenue).toFixed(2),
        orders: d.dailyOrders,
        quantity: d.dailyQuantity
      }))
    };
  }
}

export default new AnalyticsService();
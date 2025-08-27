import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import Vendor from '../models/Vendor';
import Product from '../models/Product';
import Order from '../models/Order';
import logger from '../utils/logger';

export class ImportController {
  async importAllData(_req: Request, res: Response): Promise<void> {
    try {
      const dataPath = path.join(process.cwd(), '..');

      // Import vendors
      const vendorsPath = path.join(dataPath, 'vendors.json');
      if (fs.existsSync(vendorsPath)) {
        const vendorsData = JSON.parse(fs.readFileSync(vendorsPath, 'utf8'));
        await Vendor.deleteMany({});
        await Vendor.insertMany(vendorsData);
        logger.info(`Imported ${vendorsData.length} vendors`);
      }

      // Import products
      const productsPath = path.join(dataPath, 'parent_products.json');
      if (fs.existsSync(productsPath)) {
        const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
        await Product.deleteMany({});
        await Product.insertMany(productsData);
        logger.info(`Imported ${productsData.length} products`);
      }

      // Import orders (in batches)
      const ordersPath = path.join(dataPath, 'orders.json');
      if (fs.existsSync(ordersPath)) {
        const ordersData = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
        await Order.deleteMany({});
        
        const batchSize = 1000;
        let importedCount = 0;
        
        for (let i = 0; i < ordersData.length; i += batchSize) {
          const batch = ordersData.slice(i, i + batchSize);
          await Order.insertMany(batch);
          importedCount += batch.length;
          logger.info(`Imported ${importedCount}/${ordersData.length} orders`);
        }
      }

      res.json({
        success: true,
        message: 'All data imported successfully',
        timestamp: new Date()
      });

    } catch (error) {
      logger.error('Import failed:', error);
      res.status(500).json({
        success: false,
        error: 'Import failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getImportStatus(_req: Request, res: Response): Promise<void> {
    try {
      const [vendorCount, productCount, orderCount] = await Promise.all([
        Vendor.countDocuments(),
        Product.countDocuments(),
        Order.countDocuments()
      ]);

      res.json({
        success: true,
        data: {
          vendors: vendorCount,
          products: productCount,
          orders: orderCount,
          total: vendorCount + productCount + orderCount
        }
      });
    } catch (error) {
      logger.error('Status check failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get import status'
      });
    }
  }
}

export default new ImportController();
import fs from 'fs';
import path from 'path';
import Vendor from '../models/Vendor';
import Product from '../models/Product';
import Order from '../models/Order';
import logger from '../utils/logger';

export class DataImportService {
  async importAllData(): Promise<void> {
    try {
      const dataPath = path.join(process.cwd(), '..');
      
      await this.importVendors(dataPath);
      await this.importProducts(dataPath);
      await this.importOrders(dataPath);
      
      logger.info('All data imported successfully');
    } catch (error) {
      logger.error('Data import failed:', error);
    }
  }

  private async importVendors(dataPath: string): Promise<void> {
    try {
      const vendorsPath = path.join(dataPath, 'vendors.json');
      if (!fs.existsSync(vendorsPath)) {
        logger.warn('Vendors file not found:', vendorsPath);
        return;
      }

      const vendorsData = JSON.parse(fs.readFileSync(vendorsPath, 'utf8'));
      const existingCount = await Vendor.countDocuments();
      
      if (existingCount === 0) {
        await Vendor.insertMany(vendorsData);
        logger.info(`Imported ${vendorsData.length} vendors`);
      } else {
        logger.info('Vendors already exist, skipping import');
      }
    } catch (error) {
      logger.error('Vendors import failed:', error);
    }
  }

  private async importProducts(dataPath: string): Promise<void> {
    try {
      const productsPath = path.join(dataPath, 'parent_products.json');
      if (!fs.existsSync(productsPath)) {
        logger.warn('Products file not found:', productsPath);
        return;
      }

      const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
      const existingCount = await Product.countDocuments();
      
      if (existingCount === 0) {
        await Product.insertMany(productsData);
        logger.info(`Imported ${productsData.length} products`);
      } else {
        logger.info('Products already exist, skipping import');
      }
    } catch (error) {
      logger.error('Products import failed:', error);
    }
  }

  private async importOrders(dataPath: string): Promise<void> {
    try {
      const ordersPath = path.join(dataPath, 'orders.json');
      if (!fs.existsSync(ordersPath)) {
        logger.warn('Orders file not found:', ordersPath);
        return;
      }

      const existingCount = await Order.countDocuments();
      
      if (existingCount === 0) {
        const ordersData = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
        const batchSize = 1000;
        
        for (let i = 0; i < ordersData.length; i += batchSize) {
          const batch = ordersData.slice(i, i + batchSize);
          await Order.insertMany(batch);
          logger.info(`Imported batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(ordersData.length / batchSize)}`);
        }
        
        logger.info(`Imported ${ordersData.length} orders total`);
      } else {
        logger.info('Orders already exist, skipping import');
      }
    } catch (error) {
      logger.error('Orders import failed:', error);
    }
  }
}

export default new DataImportService();
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import Vendor from '../models/Vendor';
import logger from '../utils/logger';

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { name, email, password } = req.body;

      const existingVendor = await Vendor.findOne({ email });
      if (existingVendor) {
        res.status(400).json({ error: 'Email already registered' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const vendor = new Vendor({
        name,
        email,
        password: hashedPassword,
        role: 'vendor'
      });

      await vendor.save();

      const token = jwt.sign(
        { id: vendor._id, email: vendor.email, role: vendor.role },
        process.env.JWT_SECRET || 'default-secret',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
      );

      res.status(201).json({
        message: 'Vendor registered successfully',
        token,
        vendor: {
          id: vendor._id,
          name: vendor.name,
          email: vendor.email,
          role: vendor.role
        }
      });
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({ error: 'Failed to register vendor' });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email, password } = req.body;

      const vendor = await Vendor.findOne({ email }).select('+password');
      if (!vendor || !vendor.password) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, vendor.password);
      if (!isPasswordValid) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const token = jwt.sign(
        { id: vendor._id, email: vendor.email, role: vendor.role },
        process.env.JWT_SECRET || 'default-secret',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
      );

      res.json({
        message: 'Login successful',
        token,
        vendor: {
          id: vendor._id,
          name: vendor.name,
          email: vendor.email,
          role: vendor.role
        }
      });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({ error: 'Failed to login' });
    }
  }

  async loginByName(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;

      if (!name) {
        res.status(400).json({ error: 'Vendor name is required' });
        return;
      }

      const vendor = await Vendor.findOne({ name });
      if (!vendor) {
        res.status(404).json({ error: 'Vendor not found' });
        return;
      }

      const token = jwt.sign(
        { id: vendor._id, email: vendor.email || '', role: vendor.role || 'vendor' },
        process.env.JWT_SECRET || 'default-secret',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
      );

      res.json({
        message: 'Login successful',
        token,
        vendor: {
          id: vendor._id,
          name: vendor.name,
          email: vendor.email,
          role: vendor.role || 'vendor'
        }
      });
    } catch (error) {
      logger.error('Login by name error:', error);
      res.status(500).json({ error: 'Failed to login' });
    }
  }

  async me(req: Request & { user?: any }, res: Response): Promise<void> {
    try {
      const vendor = await Vendor.findById(req.user?.id).select('-password');
      if (!vendor) {
        res.status(404).json({ error: 'Vendor not found' });
        return;
      }

      res.json({
        vendor: {
          id: vendor._id,
          name: vendor.name,
          email: vendor.email,
          role: vendor.role
        }
      });
    } catch (error) {
      logger.error('Get user error:', error);
      res.status(500).json({ error: 'Failed to get user info' });
    }
  }
}

export default new AuthController();
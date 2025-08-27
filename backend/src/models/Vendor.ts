import { Schema, model, Document } from 'mongoose';

export interface IVendor extends Document {
  _id: string;
  name: string;
  email?: string;
  password?: string;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const VendorSchema = new Schema<IVendor>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      select: false
    },
    role: {
      type: String,
      enum: ['vendor', 'admin'],
      default: 'vendor'
    }
  },
  {
    timestamps: true,
    collection: 'vendors'
  }
);

VendorSchema.index({ name: 'text' });

export default model<IVendor>('Vendor', VendorSchema);
import { Schema, model, Document, Types } from 'mongoose';

export interface IProduct extends Document {
  _id: string;
  name: string;
  vendor: Types.ObjectId;
  sku?: string;
  category?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    vendor: {
      type: Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
      index: true
    },
    sku: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true,
    collection: 'parent_products'
  }
);

ProductSchema.index({ vendor: 1, name: 1 });
ProductSchema.index({ name: 'text' });

export default model<IProduct>('Product', ProductSchema);
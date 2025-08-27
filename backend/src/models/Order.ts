import { Schema, model, Document, Types } from 'mongoose';
import Decimal from 'decimal.js';

export interface ICartItem {
  product: Types.ObjectId;
  variantId?: Types.ObjectId;
  series: string;
  item_count: number;
  quantity: number;
  cogs: number;
  price: number;
  vendor_margin: number;
  order_status: string;
  _id?: string;
}

export interface IOrder extends Document {
  _id: string;
  cart_item: ICartItem[];
  payment_at: Date;
  customer_id?: Types.ObjectId;
  total_amount?: number;
  status?: string;
}

const CartItemSchema = new Schema<ICartItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true
    },
    variantId: {
      type: Schema.Types.ObjectId
    },
    series: {
      type: String,
      required: true
    },
    item_count: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    cogs: {
      type: Number,
      required: true,
      get: (v: number) => new Decimal(v).toNumber(),
      set: (v: number) => new Decimal(v).toNumber()
    },
    price: {
      type: Number,
      required: true,
      get: (v: number) => new Decimal(v).toNumber(),
      set: (v: number) => new Decimal(v).toNumber()
    },
    vendor_margin: {
      type: Number,
      required: true,
      get: (v: number) => new Decimal(v).toNumber(),
      set: (v: number) => new Decimal(v).toNumber()
    },
    order_status: {
      type: String,
      required: true,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Received'],
      default: 'Pending'
    }
  },
  { _id: true }
);

const OrderSchema = new Schema<IOrder>(
  {
    cart_item: {
      type: [CartItemSchema],
      required: true,
      validate: {
        validator: function(items: ICartItem[]) {
          return items.length > 0;
        },
        message: 'Order must have at least one item'
      }
    },
    payment_at: {
      type: Date,
      required: true,
      index: true
    },
    customer_id: {
      type: Schema.Types.ObjectId
    },
    total_amount: {
      type: Number,
      get: (v: number) => v ? new Decimal(v).toNumber() : 0,
      set: (v: number) => v ? new Decimal(v).toNumber() : 0
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Processing', 'Completed', 'Cancelled'],
      default: 'Pending'
    }
  },
  {
    timestamps: true,
    collection: 'orders',
    toJSON: { getters: true },
    toObject: { getters: true }
  }
);

OrderSchema.index({ payment_at: -1 });
OrderSchema.index({ 'cart_item.product': 1 });
OrderSchema.index({ payment_at: -1, 'cart_item.product': 1 });

OrderSchema.pre('save', function(next) {
  if (this.cart_item && this.cart_item.length > 0) {
    const total = this.cart_item.reduce((sum, item) => {
      const itemTotal = new Decimal(item.price).mul(item.quantity).mul(item.item_count);
      return sum.plus(itemTotal);
    }, new Decimal(0));
    this.total_amount = total.toNumber();
  }
  next();
});

export default model<IOrder>('Order', OrderSchema);
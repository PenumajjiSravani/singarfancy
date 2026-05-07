import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderProduct {
    name: string;
    image: string;
    price: number;
    qty: number;
    category: string;
}

export interface IOrder extends Document {
    userId: string;
    userEmail: string;
    products: IOrderProduct[];
    total: number;
    status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    address: string;
    date: Date;
}

const OrderSchema = new Schema<IOrder>({
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },
    products: [{
        name: String,
        image: String,
        price: Number,
        qty: Number,
        category: String,
    }],
    total: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Processing',
    },
    address: { type: String, default: '' },
    date: { type: Date, default: Date.now },
}, { timestamps: true });

export const Order: Model<IOrder> =
    mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

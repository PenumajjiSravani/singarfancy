import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    price: number;
    mrp: number;
    description: string;
    image: string;
    category: 'fancy' | 'cosmetics';
    subcategory: string;
}

const ProductSchema = new Schema<IProduct>({
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    mrp: { type: Number, required: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    category: { type: String, enum: ['fancy', 'cosmetics'], required: true },
    subcategory: { type: String, required: true },
}, { timestamps: true });

export const Product: Model<IProduct> =
    mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

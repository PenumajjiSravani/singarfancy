import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Product } from '@/models/Product';
import { Order } from '@/models/Order';
import bcrypt from 'bcryptjs';

export async function POST() {
    try {
        await connectDB();

        // --- Seed Users ---
        const adminExists = await User.findOne({ email: 'admin@singar.com' });
        if (!adminExists) {
            await User.create({
                name: 'Admin',
                email: 'admin@singar.com',
                password: await bcrypt.hash('admin123', 12),
                role: 'admin',
                provider: 'email',
                joinDate: new Date('2025-01-01'),
            });
        }

        const sampleUsers = [
            { name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 9876543210', joinDate: new Date('2025-12-01') },
            { name: 'Anita Reddy', email: 'anita@example.com', phone: '+91 9123456780', joinDate: new Date('2026-01-15') },
            { name: 'Meena Iyer', email: 'meena@example.com', phone: '+91 9988776655', joinDate: new Date('2026-02-20') },
            { name: 'Kavya Nair', email: 'kavya@example.com', phone: '+91 8877665544', joinDate: new Date('2026-03-10') },
            { name: 'Deepa Kulkarni', email: 'deepa@example.com', phone: '+91 7766554433', joinDate: new Date('2026-04-01') },
        ];

        const createdUsers: Record<string, string> = {};
        for (const u of sampleUsers) {
            let existing = await User.findOne({ email: u.email });
            if (!existing) {
                existing = await User.create({
                    ...u,
                    password: await bcrypt.hash('user1234', 12),
                    role: 'user',
                    provider: 'email',
                });
            }
            createdUsers[u.name] = existing._id.toString();
        }

        // --- Seed Products ---
        const productCount = await Product.countDocuments();
        let productIds: string[] = [];
        if (productCount === 0) {
            const products = await Product.insertMany([
                { name: 'Pearl Drop Earrings', price: 899, mrp: 1299, description: 'Elegant pearl drop earrings with gold finish.', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800', category: 'fancy', subcategory: 'Earrings' },
                { name: 'Royal Gold Bangle Set', price: 1499, mrp: 2199, description: 'Classic gold-plated ethnic bangles.', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800', category: 'fancy', subcategory: 'Bangles' },
                { name: 'Maharani Kundan Necklace', price: 3499, mrp: 4999, description: 'Luxurious kundan necklace with gold detailing.', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800', category: 'fancy', subcategory: 'Necklaces' },
                { name: 'Crystal Bloom Hair Clip', price: 549, mrp: 799, description: 'Delicate floral hair clip for special occasions.', image: 'https://images.unsplash.com/photo-1576185055363-22003c4fc074?q=80&w=800', category: 'fancy', subcategory: 'Hair Accessories' },
                { name: 'Velvet Matte Lipstick', price: 499, mrp: 799, description: 'Long-lasting deep burgundy matte lipstick.', image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?q=80&w=800', category: 'cosmetics', subcategory: 'Lips' },
                { name: 'Luxury Oud Perfume', price: 2499, mrp: 3999, description: 'Exotic oud fragrance with floral notes.', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800', category: 'cosmetics', subcategory: 'Fragrance' },
                { name: 'Gilded Eyeshadow Palette', price: 1899, mrp: 2999, description: '12-shade palette with deep golds and burgundies.', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800', category: 'cosmetics', subcategory: 'Eyes' },
                { name: 'Silk Skin Night Cream', price: 1299, mrp: 1799, description: 'Intense hydration night cream for glowing skin.', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800', category: 'cosmetics', subcategory: 'Skincare' },
            ]);
            productIds = products.map((p) => p._id.toString());
        }

        // --- Seed Orders ---
        const orderCount = await Order.countDocuments();
        if (orderCount === 0) {
            const priyaId = createdUsers['Priya Sharma'];
            const anitaId = createdUsers['Anita Reddy'];
            const meenaId = createdUsers['Meena Iyer'];

            await Order.insertMany([
                { userId: priyaId, userEmail: 'priya@example.com', products: [{ name: 'Pearl Drop Earrings', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=200', price: 899, qty: 1, category: 'fancy' }, { name: 'Velvet Matte Lipstick', image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?q=80&w=200', price: 499, qty: 2, category: 'cosmetics' }], total: 1897, status: 'Delivered', address: '12 MG Road, Bengaluru, Karnataka 560001', date: new Date('2026-04-22') },
                { userId: priyaId, userEmail: 'priya@example.com', products: [{ name: 'Royal Gold Bangle Set', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=200', price: 1499, qty: 1, category: 'fancy' }], total: 1499, status: 'Shipped', address: '12 MG Road, Bengaluru, Karnataka 560001', date: new Date('2026-05-01') },
                { userId: priyaId, userEmail: 'priya@example.com', products: [{ name: 'Luxury Oud Perfume', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=200', price: 2499, qty: 1, category: 'cosmetics' }], total: 2499, status: 'Processing', address: '12 MG Road, Bengaluru, Karnataka 560001', date: new Date('2026-05-04') },
                { userId: anitaId, userEmail: 'anita@example.com', products: [{ name: 'Maharani Kundan Necklace', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=200', price: 3499, qty: 1, category: 'fancy' }], total: 3499, status: 'Delivered', address: '5 Park Street, Kolkata, WB 700016', date: new Date('2026-04-18') },
                { userId: meenaId, userEmail: 'meena@example.com', products: [{ name: 'Gilded Eyeshadow Palette', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=200', price: 1899, qty: 1, category: 'cosmetics' }, { name: 'Silk Skin Night Cream', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=200', price: 1299, qty: 1, category: 'cosmetics' }], total: 3198, status: 'Processing', address: '88 Juhu Beach Rd, Mumbai, MH 400049', date: new Date('2026-05-05') },
                { userId: anitaId, userEmail: 'anita@example.com', products: [{ name: 'Velvet Matte Lipstick', image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?q=80&w=200', price: 499, qty: 3, category: 'cosmetics' }], total: 1497, status: 'Shipped', address: '5 Park Street, Kolkata, WB 700016', date: new Date('2026-05-03') },
            ]);
        }

        return NextResponse.json({
            success: true,
            message: 'Database seeded successfully!',
            info: {
                adminEmail: 'admin@singar.com',
                adminPassword: 'admin123',
                sampleUserEmail: 'priya@example.com',
                sampleUserPassword: 'user1234',
            }
        });
    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json({ error: 'Seeding failed', details: String(error) }, { status: 500 });
    }
}

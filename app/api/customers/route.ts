import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Order } from '@/models/Order';

export async function GET(_req: NextRequest) {
    try {
        await connectDB();
        const users = await User.find({ role: 'user' }).select('-password').lean();

        const customersWithStats = await Promise.all(
            users.map(async (user) => {
                const orders = await Order.find({ userId: user._id.toString() }).lean();
                const totalSpent = orders
                    .filter((o) => o.status === 'Delivered')
                    .reduce((sum, o) => sum + o.total, 0);
                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    phone: user.phone || '—',
                    orders: orders.length,
                    totalSpent,
                    joinDate: user.joinDate,
                    avatar: user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase(),
                };
            })
        );

        return NextResponse.json(customersWithStats);
    } catch (error) {
        console.error('Customers GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
    }
}

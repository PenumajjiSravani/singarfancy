import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/models/Order';

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const all = searchParams.get('all');

        let filter = {};
        if (userId && !all) {
            filter = { userId };
        }

        const orders = await Order.find(filter).sort({ date: -1 }).lean();
        return NextResponse.json(orders);
    } catch (error) {
        console.error('Orders GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const order = await Order.create({ ...body, date: new Date() });
        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        console.error('Orders POST error:', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        await connectDB();
        const { id, status } = await req.json();
        const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
        return NextResponse.json(order);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}

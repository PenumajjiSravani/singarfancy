import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { name, email, password, phone, provider } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
        }

        let hashedPassword: string | undefined;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 12);
        }

        const user = await User.create({
            name: name || 'User',
            email: email.toLowerCase(),
            password: hashedPassword,
            phone: phone || '',
            role: 'user',
            provider: provider || 'email',
            joinDate: new Date(),
        });

        return NextResponse.json({
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            role: user.role,
            joinDate: user.joinDate,
        }, { status: 201 });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
    }
}

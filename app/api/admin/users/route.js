import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getUserFromCookie } from '@/utils/auth';

export async function GET(req) {
  try {
    const user = getUserFromCookie();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || 'all';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    await connectDB();

    // Build query
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role !== 'all') {
      query.role = role;
    }

    const totalUsers = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({ 
      success: true, 
      data: users,
      meta: {
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const user = getUserFromCookie();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { name, email, phone, password, role } = await req.json();

    if (!password) {
      return NextResponse.json({ success: false, error: 'Password is required' }, { status: 400 });
    }

    await connectDB();
    
    // Check if user exists
    const query = { $or: [{ email }] };
    if (phone) {
      query.$or.push({ phone });
    }

    const existingUser = await User.findOne(query);
    if (existingUser) {
      const conflictField = existingUser.email === email ? 'Email' : 'Phone number';
      return NextResponse.json({ success: false, error: `${conflictField} already exists` }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role
    });

    return NextResponse.json({ success: true, data: newUser });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

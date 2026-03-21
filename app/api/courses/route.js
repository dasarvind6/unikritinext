import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Course from '@/models/Course';
import { getUserFromCookie } from '@/utils/auth';

// Fetch all courses (public or instructor-specific)
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const filter = {};

    // For public courses, we only show published. If requested by an instructor, we show their courses.
    const user = getUserFromCookie();
    if (searchParams.get('instructor') === 'true' && user && ['admin', 'instructor'].includes(user.role)) {
       filter.instructor = user.id;
    } else {
       filter.isPublished = true;
    }

    const courses = await Course.find(filter).populate('instructor', 'name avatar');
    return NextResponse.json({ success: true, data: courses }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Create a new course
export async function POST(req) {
  try {
    const user = getUserFromCookie();
    if (!user || user.role === 'student') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    await connectDB();
    
    body.instructor = user.id; // Force instructor to be the creator
    
    const course = await Course.create(body);
    return NextResponse.json({ success: true, data: course }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

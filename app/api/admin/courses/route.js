import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Course from '@/models/Course';
import { getUserFromCookie } from '@/utils/auth';
import mongoose from 'mongoose';

export async function GET(req) {
  try {
    const user = getUserFromCookie();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const courses = await Course.find({})
      .populate('instructor', 'name email')
      .sort({ createdAt: -1 });

    // Normalize categories: ensure categoryIds is an array and include legacy category if present
    const normalizedCourses = courses.map(course => {
      const obj = course.toObject();
      let cIds = Array.isArray(obj.categoryIds) ? obj.categoryIds.map(id => id.toString()) : [];
      
      // Fallback: if categoryIds is empty but legacy category exists, keep it in view
      // Note: We might want to look up the Category by name in a more advanced migration, 
      // but for now we just handle the presence of the data.
      
      obj.categoryIds = cIds;
      return obj;
    });

    return NextResponse.json({ success: true, data: normalizedCourses });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = getUserFromCookie();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const courseData = await req.json();
    
    // Explicitly cast categoryIds to ObjectIds
    if (courseData.categoryIds && Array.isArray(courseData.categoryIds)) {
      courseData.categoryIds = courseData.categoryIds
        .filter(id => mongoose.Types.ObjectId.isValid(id))
        .map(id => new mongoose.Types.ObjectId(id));
    }

    await connectDB();
    const newCourse = await Course.create({
        ...courseData,
        category: undefined // Ensure legacy field isn't accidentally set with junk
    });

    return NextResponse.json({ success: true, data: newCourse });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const user = getUserFromCookie();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId, ...updateData } = await req.json();

    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
        return NextResponse.json({ success: false, error: 'Invalid Course ID' }, { status: 400 });
    }

    // Explicitly cast categoryIds to ObjectIds
    if (updateData.categoryIds && Array.isArray(updateData.categoryIds)) {
      updateData.categoryIds = updateData.categoryIds
        .filter(id => mongoose.Types.ObjectId.isValid(id))
        .map(id => new mongoose.Types.ObjectId(id));
    }

    await connectDB();
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { 
          $set: updateData,
          $unset: { category: 1 } // Migration: remove legacy category string
      },
      { new: true }
    );

    if (!updatedCourse) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedCourse });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const user = getUserFromCookie();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');

    await connectDB();
    const deletedCourse = await Course.findByIdAndDelete(courseId);

    if (!deletedCourse) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Enrollment from '@/models/Enrollment';
import Course from '@/models/Course';
import Section from '@/models/Section';
import Lesson from '@/models/Lesson';
import { getUserFromCookie } from '@/utils/auth';

// Mark a lesson as completed and update progress
export async function POST(req) {
  try {
    const user = getUserFromCookie();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId, lessonId } = await req.json();
    if (!courseId || !lessonId) {
      return NextResponse.json({ success: false, error: 'Course ID and Lesson ID are required' }, { status: 400 });
    }

    await connectDB();

    const enrollment = await Enrollment.findOne({ userId: user.id, courseId });
    if (!enrollment) {
      return NextResponse.json({ success: false, error: 'Enrollment not found' }, { status: 404 });
    }

    // Add lesson to completedLessons if not already there
    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
      
      // Calculate new progress percentage
      // First, get total lessons in the course
      const sections = await Section.find({ courseId });
      const sectionIds = sections.map(s => s._id);
      const totalLessonsCount = await Lesson.countDocuments({ sectionId: { $in: sectionIds } });
      
      if (totalLessonsCount > 0) {
        enrollment.progress = Math.round((enrollment.completedLessons.length / totalLessonsCount) * 100);
      } else {
        enrollment.progress = 100;
      }

      if (enrollment.progress >= 100) {
        enrollment.completed = true;
      }

      await enrollment.save();
    }

    return NextResponse.json({ success: true, data: enrollment }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Get progress for a specific course
export async function GET(req) {
  try {
    const user = getUserFromCookie();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json({ success: false, error: 'Course ID is required' }, { status: 400 });
    }

    await connectDB();
    const enrollment = await Enrollment.findOne({ userId: user.id, courseId });

    return NextResponse.json({ success: true, data: enrollment }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

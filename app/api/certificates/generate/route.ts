import { connectDB } from '@/lib/db'
import Progress from '@/lib/models/Progress'
import Course from '@/lib/models/Course'
import User from '@/lib/models/User'
import { getCurrentUser } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { courseId } = await req.json()

    await connectDB()

    // Get course details
    const course = await Course.findById(courseId).lean()
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Get user progress
    const progress = await Progress.findOne({
      userId: currentUser.userId,
      courseId,
    })

    if (!progress) {
      return NextResponse.json({ error: 'No progress found for this course' }, { status: 404 })
    }

    // Check if all lessons are completed
    if (progress.lessonsCompleted.length !== course.lessons.length) {
      return NextResponse.json(
        { error: 'Not all lessons completed. Complete all lessons to generate a certificate.' },
        { status: 400 }
      )
    }

    // Get user details
    const user = await User.findById(currentUser.userId).lean()

    // Generate certificate URL (in production, this would be an actual image/PDF)
    const certificateData = {
      studentName: user?.name || 'Student',
      courseName: course.title,
      completionDate: new Date().toLocaleDateString(),
      certificateId: `CERT-${courseId}-${currentUser.userId}-${Date.now()}`,
    }

    // Update progress with certificate
    progress.certificateGenerated = true
    progress.certificateUrl = JSON.stringify(certificateData)
    await progress.save()

    return NextResponse.json({
      certificate: certificateData,
      certificateId: certificateData.certificateId,
      message: 'Certificate generated successfully',
    })
  } catch (error) {
    console.error('[v0] Certificate generation error:', error)
    return NextResponse.json({ error: 'Failed to generate certificate' }, { status: 500 })
  }
}

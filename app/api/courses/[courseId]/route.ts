import { connectDB } from '@/lib/db'
import Course from '@/lib/models/Course'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const { courseId } = await params
    await connectDB()
    const course = await Course.findById(courseId).lean()

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    return NextResponse.json({ course })
  } catch (error) {
    console.error('[v0] Failed to fetch course:', error)
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 })
  }
}

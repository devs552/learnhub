import { NextRequest, NextResponse } from 'next/server'
import Course from '@/lib/models/Course'
import Exercise from '@/lib/models/Exercise'
import { connectDB } from '@/lib/db'
import { verifyTokenSync } from '@/lib/auth'

function requireAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value
  if (!token) return null
  const decoded = verifyTokenSync(token)
  if (!decoded || decoded.role !== 'admin') return null
  return decoded
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { courseId: string; lessonId: string } }
) {
  try {
    const { courseId, lessonId } = await params
    await connectDB()

    if (!requireAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, description, content, order } = await req.json()

    const course = await Course.findById(courseId)
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    const lesson = (course.lessons as any).id(lessonId)
    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    if (title !== undefined) lesson.title = title
    if (description !== undefined) lesson.description = description
    if (content !== undefined) lesson.content = content
    if (order !== undefined) lesson.order = order

    await course.save()

    return NextResponse.json({ course })
  } catch (error: any) {
    console.error('[v0] Failed to update lesson:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { courseId: string; lessonId: string } }
) {
  try {
    const { courseId, lessonId } = await params
    await connectDB()

    if (!requireAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const course = await Course.findById(courseId)
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    const lesson = (course.lessons as any).id(lessonId)
    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    lesson.deleteOne()
    await course.save()

    // Exercises are keyed to lessonId independently — clean those up too so
    // deleting a lesson doesn't leave orphaned exercises behind.
    await Exercise.deleteMany({ lessonId })

    return NextResponse.json({ course })
  } catch (error: any) {
    console.error('[v0] Failed to delete lesson:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
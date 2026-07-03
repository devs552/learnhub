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

export async function GET(req: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const { courseId } = await params
    await connectDB()

    if (!requireAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const course = await Course.findById(courseId).lean()
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    return NextResponse.json({ course })
  } catch (error: any) {
    console.error('[v0] Failed to fetch course:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const { courseId } = await params
    await connectDB()

    if (!requireAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, description, icon, level } = await req.json()

    const course = await Course.findByIdAndUpdate(
      courseId,
      { $set: { title, description, icon, level } },
      { new: true, runValidators: true }
    )

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    return NextResponse.json({ course })
  } catch (error: any) {
    console.error('[v0] Failed to update course:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const { courseId } = await params
    await connectDB()

    if (!requireAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const course = await Course.findByIdAndDelete(courseId)
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Clean up orphaned exercises that belonged to this course, since
    // Exercise documents reference courseId independently of the Course's
    // embedded lessons array.
    await Exercise.deleteMany({ courseId })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[v0] Failed to delete course:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
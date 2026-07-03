import { NextRequest, NextResponse } from 'next/server'
import Course from '@/lib/models/Course'
import { connectDB } from '@/lib/db'
import { verifyTokenSync } from '@/lib/auth'

function requireAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value
  if (!token) return null
  const decoded = verifyTokenSync(token)
  if (!decoded || decoded.role !== 'admin') return null
  return decoded
}

export async function POST(req: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const { courseId } = await params
    await connectDB()

    if (!requireAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, description, content, order } = await req.json()

    if (!title || !description || !content) {
      return NextResponse.json(
        { error: 'title, description, and content are required' },
        { status: 400 }
      )
    }

    const course = await Course.findById(courseId)
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Default new lessons to the end of the list unless an explicit order
    // was given.
    const nextOrder = order ?? course.lessons.length

    course.lessons.push({ title, description, content, order: nextOrder } as any)
    await course.save()

    return NextResponse.json({ course }, { status: 201 })
  } catch (error: any) {
    console.error('[v0] Failed to add lesson:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
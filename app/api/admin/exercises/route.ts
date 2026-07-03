import { NextRequest, NextResponse } from 'next/server'
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

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    if (!requireAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const courseId = req.nextUrl.searchParams.get('courseId')
    const lessonId = req.nextUrl.searchParams.get('lessonId')

    const query: Record<string, string> = {}
    if (courseId) query.courseId = courseId
    if (lessonId) query.lessonId = lessonId

    const exercises = await Exercise.find(query).sort({ order: 1 }).lean()
    return NextResponse.json({ exercises })
  } catch (error: any) {
    console.error('[v0] Failed to list exercises:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    if (!requireAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { courseId, lessonId, title, content, order } = await req.json()

    if (!courseId || !lessonId || !title || !content) {
      return NextResponse.json(
        { error: 'courseId, lessonId, title, and content are required' },
        { status: 400 }
      )
    }

    if (!['multiple-choice', 'code-challenge'].includes(content.type)) {
      return NextResponse.json(
        { error: 'content.type must be "multiple-choice" or "code-challenge"' },
        { status: 400 }
      )
    }

    // Default new exercises to the end of the current lesson's list unless
    // an explicit order was given.
    let nextOrder = order
    if (nextOrder === undefined) {
      const count = await Exercise.countDocuments({ lessonId })
      nextOrder = count
    }

    const exercise = await Exercise.create({
      courseId,
      lessonId,
      title,
      content,
      order: nextOrder,
    })

    return NextResponse.json({ exercise }, { status: 201 })
  } catch (error: any) {
    console.error('[v0] Failed to create exercise:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
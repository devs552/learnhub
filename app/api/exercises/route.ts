import { connectDB } from '@/lib/db'
import Exercise from '@/lib/models/Exercise'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const courseId = req.nextUrl.searchParams.get('courseId')
    const lessonId = req.nextUrl.searchParams.get('lessonId')

    await connectDB()

    const query: any = {}
    if (courseId) query.courseId = courseId
    if (lessonId) query.lessonId = lessonId

    const exercises = await Exercise.find(query).lean()
    return NextResponse.json({ exercises })
  } catch (error) {
    console.error('[v0] Failed to fetch exercises:', error)
    return NextResponse.json({ error: 'Failed to fetch exercises' }, { status: 500 })
  }
}

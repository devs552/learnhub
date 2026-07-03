import { connectDB } from '@/lib/db'
import Progress from '@/lib/models/Progress'
import { getCurrentUser } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    await connectDB()
    const userProgress = await Progress.find({ userId: currentUser.userId }).lean()

    return NextResponse.json({ progress: userProgress })
  } catch (error) {
    console.error('[v0] Failed to fetch progress:', error)
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { courseId, lessonId, exerciseId, score } = await req.json()

    await connectDB()

    let progress = await Progress.findOne({
      userId: currentUser.userId,
      courseId,
    })

    if (!progress) {
      progress = new Progress({
        userId: currentUser.userId,
        courseId,
      })
    }

    if (lessonId && !progress.lessonsCompleted.includes(lessonId)) {
      progress.lessonsCompleted.push(lessonId)
    }

    if (exerciseId) {
      progress.exercisesCompleted.push({
        exerciseId,
        score,
        completedAt: new Date(),
      })
      progress.totalScore = Math.round(
        progress.exercisesCompleted.reduce((sum: number, e: any) => sum + e.score, 0) /
          progress.exercisesCompleted.length
      )
    }

    await progress.save()

    return NextResponse.json({ progress })
  } catch (error) {
    console.error('[v0] Failed to update progress:', error)
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 })
  }
}

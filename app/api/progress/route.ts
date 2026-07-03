import { connectDB } from '@/lib/db'
import Progress from '@/lib/models/Progress'
import { getCurrentUser } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // getCurrentUser() implementations vary — some return `id`, some the raw
    // Mongo `_id` (string or ObjectId), some `userId`. Resolve whichever is
    // present so we never silently pass `undefined` into a required field.
    const userId = currentUser.id || currentUser._id || currentUser.userId

    if (!userId) {
      console.error('[v0] getCurrentUser() returned no usable id field:', currentUser)
      return NextResponse.json({ error: 'Could not resolve current user id' }, { status: 500 })
    }

    const { courseId, type, lessonId, exerciseId, score } = await req.json()

    if (!courseId || !type) {
      return NextResponse.json({ error: 'courseId and type are required' }, { status: 400 })
    }

    if (!['lesson', 'exercise'].includes(type)) {
      return NextResponse.json({ error: 'type must be "lesson" or "exercise"' }, { status: 400 })
    }

    await connectDB()

    if (type === 'lesson') {
      if (!lessonId) {
        return NextResponse.json({ error: 'lessonId is required' }, { status: 400 })
      }

      // $addToSet avoids duplicate lesson IDs if the user re-completes the same lesson.
      // upsert:true creates the Progress doc on first completion; the unique
      // (userId, courseId) index means this never creates a duplicate row —
      // it's safe to call repeatedly, including from concurrent requests.
      await Progress.findOneAndUpdate(
        { userId: userId, courseId },
        { $addToSet: { lessonsCompleted: lessonId } },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
      )
    } else {
      if (!exerciseId || typeof score !== 'number') {
        return NextResponse.json(
          { error: 'exerciseId and numeric score are required' },
          { status: 400 }
        )
      }

      // Drop any previous attempt at this exercise before pushing the new one,
      // so re-attempting doesn't pile up duplicate entries or inflate totalScore.
      await Progress.findOneAndUpdate(
        { userId: userId, courseId },
        { $pull: { exercisesCompleted: { exerciseId } } },
        { upsert: true, setDefaultsOnInsert: true }
      )

      await Progress.findOneAndUpdate(
        { userId: userId, courseId },
        {
          $push: {
            exercisesCompleted: { exerciseId, score, completedAt: new Date() },
          },
        },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
      )
    }

    // Recompute totalScore as the average of all exercise scores for this course.
    const progress = await Progress.findOne({ userId: userId, courseId })

    if (progress) {
      const scores = progress.exercisesCompleted.map((e: any) => e.score)
      const totalScore =
        scores.length > 0
          ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length)
          : 0

      if (progress.totalScore !== totalScore) {
        progress.totalScore = totalScore
        await progress.save()
      }
    }

    return NextResponse.json({ message: 'Progress saved', progress })
  } catch (error: any) {
    console.error('[v0] Progress save error:', error)

    // Race condition safety net: if two requests both tried to upsert the
    // first-ever Progress doc for this user+course at the same instant,
    // Mongo's unique index can throw E11000 even with upsert:true. The
    // client can simply retry; the doc will exist by then.
    if (error?.code === 11000) {
      return NextResponse.json(
        { error: 'Progress update conflicted, please retry' },
        { status: 409 }
      )
    }

    return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const userId = currentUser.id || currentUser._id || currentUser.userId

    if (!userId) {
      console.error('[v0] getCurrentUser() returned no usable id field:', currentUser)
      return NextResponse.json({ error: 'Could not resolve current user id' }, { status: 500 })
    }

    const courseId = req.nextUrl.searchParams.get('courseId')

    if (!courseId) {
      return NextResponse.json({ error: 'courseId is required' }, { status: 400 })
    }

    await connectDB()

    const progress = await Progress.findOne({ userId: userId, courseId })

    return NextResponse.json({ progress: progress || null })
  } catch (error: any) {
    console.error('[v0] Progress fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }
}
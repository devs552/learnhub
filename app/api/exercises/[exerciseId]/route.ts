import { connectDB } from '@/lib/db'
import Exercise from '@/lib/models/Exercise'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: { exerciseId: string } }) {
  try {
    const { exerciseId } = await params
    await connectDB()
    const exercise = await Exercise.findById(exerciseId).lean()

    if (!exercise) {
      return NextResponse.json({ error: 'Exercise not found' }, { status: 404 })
    }

    return NextResponse.json({ exercise })
  } catch (error) {
    console.error('[v0] Failed to fetch exercise:', error)
    return NextResponse.json({ error: 'Failed to fetch exercise' }, { status: 500 })
  }
}

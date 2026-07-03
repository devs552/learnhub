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

export async function GET(req: NextRequest, { params }: { params: { exerciseId: string } }) {
  try {
    const { exerciseId } = await params
    await connectDB()

    if (!requireAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const exercise = await Exercise.findById(exerciseId).lean()
    if (!exercise) {
      return NextResponse.json({ error: 'Exercise not found' }, { status: 404 })
    }

    return NextResponse.json({ exercise })
  } catch (error: any) {
    console.error('[v0] Failed to fetch exercise:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { exerciseId: string } }) {
  try {
    const { exerciseId } = await params
    await connectDB()

    if (!requireAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, content, order } = await req.json()

    const exercise = await Exercise.findByIdAndUpdate(
      exerciseId,
      { $set: { title, content, order } },
      { new: true, runValidators: true }
    )

    if (!exercise) {
      return NextResponse.json({ error: 'Exercise not found' }, { status: 404 })
    }

    return NextResponse.json({ exercise })
  } catch (error: any) {
    console.error('[v0] Failed to update exercise:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { exerciseId: string } }) {
  try {
    const { exerciseId } = await params
    await connectDB()

    if (!requireAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const exercise = await Exercise.findByIdAndDelete(exerciseId)
    if (!exercise) {
      return NextResponse.json({ error: 'Exercise not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[v0] Failed to delete exercise:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
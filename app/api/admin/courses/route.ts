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

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    if (!requireAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const courses = await Course.find({}).sort({ createdAt: -1 }).lean()
    return NextResponse.json({ courses })
  } catch (error: any) {
    console.error('[v0] Failed to list courses:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    if (!requireAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, description, icon, level } = await req.json()

    if (!title || !description || !icon) {
      return NextResponse.json({ error: 'title, description, and icon are required' }, { status: 400 })
    }

    const course = await Course.create({
      title,
      description,
      icon,
      level: level || 'beginner',
      lessons: [],
    })

    return NextResponse.json({ course }, { status: 201 })
  } catch (error: any) {
    console.error('[v0] Failed to create course:', error)
    if (error.code === 11000) {
      return NextResponse.json({ error: 'A course with this title already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
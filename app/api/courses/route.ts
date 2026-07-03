import { connectDB } from '@/lib/db'
import Course from '@/lib/models/Course'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await connectDB()
    const courses = await Course.find().lean()
    return NextResponse.json({ courses })
  } catch (error) {
    console.error('[v0] Failed to fetch courses:', error)
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import User from '@/lib/models/User'
import { connectDB } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const email = req.nextUrl.searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      approvalStatus: user.approvalStatus,
      email: user.email,
      name: user.name,
    })
  } catch (error: any) {
    console.error('[v0] Approval status error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}

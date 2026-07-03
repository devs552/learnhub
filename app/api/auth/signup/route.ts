import { connectDB } from '@/lib/db'
import User from '@/lib/models/User'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json()

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    await connectDB()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    // Create new user with pending approval status
    const user = await User.create({
      email,
      password,
      name,
      approvalStatus: 'pending',
      approvalRequestedAt: new Date(),
    })

    // Don't create token - user must wait for admin approval
    return NextResponse.json(
      {
        message: 'Signup successful! Awaiting admin approval.',
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          approvalStatus: user.approvalStatus,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[v0] Signup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

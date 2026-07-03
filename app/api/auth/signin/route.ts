import { connectDB } from '@/lib/db'
import User from '@/lib/models/User'
import { createToken, setAuthCookie } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 })
    }

    await connectDB()

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Check approval status
    if (user.approvalStatus === 'pending') {
      return NextResponse.json(
        { error: 'Your account is awaiting admin approval. Please check your email for updates.' },
        { status: 403 }
      )
    }

    if (user.approvalStatus === 'rejected') {
      return NextResponse.json({ error: 'Your enrollment request was rejected.' }, { status: 403 })
    }

    // Create token and set cookie
    const token = await createToken({
      userId: user._id.toString(),
      email: user.email,
      _id: undefined
    })

    await setAuthCookie(token)

    return NextResponse.json({
      message: 'Signed in successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error('[v0] Signin error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

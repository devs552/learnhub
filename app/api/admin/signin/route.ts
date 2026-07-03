import { NextRequest, NextResponse } from 'next/server'
import Admin from '@/lib/models/Admin'
import { connectDB } from '@/lib/db'
import { createToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() })

    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const isValidPassword = await admin.verifyPassword(password)

    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = await createToken({ 
      id: admin._id.toString(), 
      email: admin.email, 
      role: 'admin' 
    } as any)

    const response = NextResponse.json({
      token,
      admin: { id: admin._id, email: admin.email, name: admin.name, role: 'admin' },
    })

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    })

    return response
  } catch (error: any) {
    console.error('Admin signin error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import User from '@/lib/models/User'
import { connectDB } from '@/lib/db'
import { verifyTokenSync } from '@/lib/auth'
import nodemailer from 'nodemailer'

// Email configuration - using console transport for demo
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: parseInt(process.env.SMTP_PORT || '1025'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: process.env.SMTP_USER
    ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    : undefined,
})

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const token = req.cookies.get('admin_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyTokenSync(token)

    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId, action } = await req.json()

    if (!userId || !action) {
      return NextResponse.json({ error: 'User ID and action required' }, { status: 400 })
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const user = await User.findById(userId)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (action === 'approve') {
      user.approvalStatus = 'approved'
      user.approvedAt = new Date()
      user.approvedBy = decoded.id
      await user.save()

      // Send approval email
      try {
        await transporter.sendMail({
          from: `"LearnHub" <${process.env.SMTP_FROM || 'noreply@learnhub.com'}>`,
          to: user.email,
          subject: 'Your LearnHub Enrollment is Approved!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #00d4ff;">Welcome to LearnHub!</h2>
              <p>Hi ${user.name},</p>
              <p>Great news! Your enrollment request has been approved by our admin team.</p>
              <p>You can now log in and start learning with our courses:</p>
              <ul style="color: #666;">
                <li>HTML Basics</li>
                <li>CSS Styling</li>
                <li>JavaScript Essentials</li>
                <li>React Fundamentals</li>
              </ul>
              <p>
                <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/signin" 
                   style="display: inline-block; padding: 12px 24px; background: #00d4ff; color: #0a0e27; text-decoration: none; border-radius: 8px; font-weight: bold;">
                  Login to Dashboard
                </a>
              </p>
              <p>Happy learning!</p>
              <p style="color: #999; font-size: 12px;">LearnHub Team</p>
            </div>
          `,
        })
      } catch (emailError) {
        console.error('[v0] Email sending error:', emailError)
        // Continue anyway - don't fail the approval due to email issues
      }
    } else if (action === 'reject') {
      user.approvalStatus = 'rejected'
      await user.save()

      // Send rejection email
      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || 'noreply@learnhub.com',
          to: user.email,
          subject: 'Your LearnHub Enrollment Request',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #ff006e;">LearnHub Enrollment Update</h2>
              <p>Hi ${user.name},</p>
              <p>Thank you for your interest in LearnHub. Unfortunately, your enrollment request has not been approved at this time.</p>
              <p>If you have any questions, please contact our support team.</p>
              <p>Best regards,</p>
              <p style="color: #999; font-size: 12px;">LearnHub Team</p>
            </div>
          `,
        })
      } catch (emailError) {
        console.error('[v0] Email sending error:', emailError)
      }
    }

    return NextResponse.json({
      message: `User ${action}ed successfully`,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        approvalStatus: user.approvalStatus,
      },
    })
  } catch (error: any) {
    console.error('[v0] Admin approval error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const token = req.cookies.get('admin_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyTokenSync(token)

    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const status = req.nextUrl.searchParams.get('status') || 'pending'

    const users = await User.find({ approvalStatus: status }).select('-password')

    return NextResponse.json({ users })
  } catch (error: any) {
    console.error('[v0] Get pending users error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}

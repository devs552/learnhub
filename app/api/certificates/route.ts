import { connectDB } from '@/lib/db'
import Progress from '@/lib/models/Progress'
import { getCurrentUser } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    await connectDB()

    const certificates = await Progress.find({
      userId: currentUser.userId,
      certificateGenerated: true,
    })
      .populate('courseId', 'title icon')
      .lean()

    const formattedCertificates = certificates.map((cert: any) => ({
      courseId: cert.courseId?._id,
      courseName: cert.courseId?.title,
      courseIcon: cert.courseId?.icon,
      certificateData: cert.certificateUrl ? JSON.parse(cert.certificateUrl) : null,
      generatedAt: cert.updatedAt,
    }))

    return NextResponse.json({ certificates: formattedCertificates })
  } catch (error) {
    console.error('[v0] Failed to fetch certificates:', error)
    return NextResponse.json({ error: 'Failed to fetch certificates' }, { status: 500 })
  }
}

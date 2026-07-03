import { NextRequest, NextResponse } from 'next/server'
import Progress from '@/lib/models/Progress'
import { connectDB } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // getCurrentUser() implementations vary in which field holds the id —
    // resolve whichever is present rather than assuming one.
    const userId = currentUser.id || currentUser._id || currentUser.userId

    if (!userId) {
      console.error('[v0] getCurrentUser() returned no usable id field:', currentUser)
      return NextResponse.json({ error: 'Could not resolve current user id' }, { status: 500 })
    }

    const { certificateId } = await req.json()

    // Find the progress record by certificate ID pattern and update download status
    const progress = await Progress.findOneAndUpdate(
      {
        userId,
        certificateGenerated: true,
        certificateDownloaded: false,
      },
      {
        certificateDownloaded: true,
        certificateDownloadedAt: new Date(),
      },
      { new: true }
    )

    if (!progress) {
      return NextResponse.json(
        { error: 'Certificate not found or already downloaded' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Download tracked successfully',
    })
  } catch (error: any) {
    console.error('Download tracking error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
import { NextRequest, NextResponse } from 'next/server'
import User from '@/lib/models/User'
import Progress from '@/lib/models/Progress'
import mongoose from 'mongoose'
import Course from '@/lib/models/Course' // needed so .populate('courseId', ...) can resolve the model
import { connectDB } from '@/lib/db'
import { verifyTokenSync } from '@/lib/auth'

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

    // Get pending approval students
    const pendingStudents = await User.find({ approvalStatus: 'pending' })
      .select('_id name email approvalRequestedAt')
      .sort({ approvalRequestedAt: -1 })
      .lean()

    // Get all approved students
    const students = await User.find({ approvalStatus: 'approved' })
      .select('_id name email createdAt')
      .lean()

    // Get all progress records
    const progressRecords = await Progress.find({})
      .populate('userId', 'name email')
      .populate('courseId', 'title')
      .lean()

    // Some Progress records can reference a userId/courseId that no longer
    // exists (e.g. the user or course was deleted after progress was
    // recorded). populate() leaves those fields as null instead of
    // throwing, so filter them out here rather than crashing below.
    const validProgressRecords = (progressRecords as any[]).filter(
      (p) => p.userId && p.courseId
    )

    // Build comprehensive student data
    const studentData = students.map((student: any) => {
      const studentProgress = validProgressRecords.filter(
        (p: any) => p.userId._id.toString() === student._id.toString()
      )

      const courseProgress = studentProgress.map((p: any) => ({
        courseId: p.courseId._id,
        courseName: p.courseId.title,
        lessonsCompleted: p.lessonsCompleted.length,
        exercisesCompleted: p.exercisesCompleted.length,
        certificateGenerated: p.certificateGenerated,
        certificateDownloaded: p.certificateDownloaded,
        certificateDownloadedAt: p.certificateDownloadedAt,
        totalScore: p.totalScore,
        completionPercentage: Math.round((p.exercisesCompleted.length / 10) * 100), // Assuming 10 exercises per course
      }))

      const certificatesDownloaded = courseProgress.filter(
        (c: any) => c.certificateDownloaded
      ).length

      return {
        id: student._id,
        name: student.name,
        email: student.email,
        joinedAt: student.createdAt,
        courseProgress,
        totalCourses: courseProgress.length,
        certificatesDownloaded,
        overallProgress: courseProgress.length > 0
          ? Math.round(courseProgress.reduce((sum: number, c: any) => sum + c.completionPercentage, 0) / courseProgress.length)
          : 0,
      }
    })

    const stats = {
      totalStudents: students.length,
      totalEnrollments: validProgressRecords.length,
      certificatesGenerated: validProgressRecords.filter((p: any) => p.certificateGenerated).length,
      certificatesDownloaded: validProgressRecords.filter((p: any) => p.certificateDownloaded).length,
      averageCompletion: studentData.length > 0
        ? Math.round(
            studentData.reduce((sum: number, s: any) => sum + s.overallProgress, 0) / studentData.length
          )
        : 0,
      pendingApprovals: pendingStudents.length,
    }

    return NextResponse.json({
      stats,
      students: studentData.sort((a: any, b: any) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()),
      pendingStudents: (pendingStudents as any).map((s: any) => ({
        id: s._id,
        name: s.name,
        email: s.email,
        approvalRequestedAt: s.approvalRequestedAt,
      })),
    })
  } catch (error: any) {
    console.error('Dashboard error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
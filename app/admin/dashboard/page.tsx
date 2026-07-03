'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminContentPage from '../content/page'
interface CourseProgress {
  courseId: string
  courseName: string
  lessonsCompleted: number
  exercisesCompleted: number
  certificateGenerated: boolean
  certificateDownloaded: boolean
  certificateDownloadedAt: string | null
  totalScore: number
  completionPercentage: number
}

interface Student {
  id: string
  name: string
  email: string
  joinedAt: string
  courseProgress: CourseProgress[]
  totalCourses: number
  certificatesDownloaded: number
  overallProgress: number
}

interface DashboardData {
  stats: {
    totalStudents: number
    totalEnrollments: number
    certificatesGenerated: number
    certificatesDownloaded: number
    averageCompletion: number
    pendingApprovals: number
  }
  students: Student[]
  pendingStudents?: Array<{
    id: string
    name: string
    email: string
    approvalRequestedAt: string
  }>
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const router = useRouter()

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('admin_token')
        if (!token) {
          router.push('/admin/signin')
          return
        }

        const res = await fetch('/api/admin/dashboard', {
          headers: {
            Cookie: `admin_token=${token}`,
          },
        })

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem('admin_token')
            router.push('/admin/signin')
            return
          }
          throw new Error('Failed to fetch dashboard')
        }

        const dashboardData = await res.json()
        setData(dashboardData)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    router.push('/admin/signin')
  }

  const handleApproveStudent = async (userId: string) => {
    try {
      const res = await fetch('/api/admin/users/approval', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, action: 'approve' }),
      })

      if (res.ok) {
        // Refresh dashboard
        window.location.reload()
      }
    } catch (err) {
      console.error('[v0] Error approving student:', err)
    }
  }

  const handleRejectStudent = async (userId: string) => {
    try {
      const res = await fetch('/api/admin/users/approval', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, action: 'reject' }),
      })

      if (res.ok) {
        // Refresh dashboard
        window.location.reload()
      }
    } catch (err) {
      console.error('[v0] Error rejecting student:', err)
    }
  }

  const filteredStudents = data?.students.filter((student) => {
    if (filter === 'certificates') {
      return student.certificatesDownloaded > 0
    }
    return true
  }) || []

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-2xl text-primary neon-glow-cyan">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-2xl text-destructive">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-primary/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary neon-glow-cyan">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-secondary text-background font-semibold rounded-lg hover:glow-border-magenta transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Pending Approvals Alert */}
        {data?.stats.pendingApprovals! > 0 && (
          <div className="mb-8 p-6 bg-secondary/20 border-2 border-secondary rounded-lg glow-border-magenta">
            <h3 className="text-lg font-bold text-secondary mb-2">
              {data?.stats.pendingApprovals} Student{data?.stats.pendingApprovals !== 1 ? 's' : ''} Awaiting Approval
            </h3>
            <p className="text-foreground/70">
              Review and approve pending enrollment requests to allow students to start learning.
            </p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
          <StatCard
            title="Total Students"
            value={data?.stats.totalStudents || 0}
            color="cyan"
          />
          <StatCard
            title="Total Enrollments"
            value={data?.stats.totalEnrollments || 0}
            color="magenta"
          />
          <StatCard
            title="Certificates Generated"
            value={data?.stats.certificatesGenerated || 0}
            color="lime"
          />
          <StatCard
            title="Certificates Downloaded"
            value={data?.stats.certificatesDownloaded || 0}
            color="cyan"
          />
          <StatCard
            title="Pending Approvals"
            value={data?.stats.pendingApprovals || 0}
            color="secondary"
          />
        </div>

        {/* Pending Approvals Table */}
        {data?.pendingStudents && data.pendingStudents.length > 0 && (
          <div className="bg-card rounded-lg border border-secondary/50 p-8 glow-border-magenta mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Pending Student Approvals</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-primary/30">
                    <th className="text-left py-3 px-4 text-foreground font-semibold">Name</th>
                    <th className="text-left py-3 px-4 text-foreground font-semibold">Email</th>
                    <th className="text-left py-3 px-4 text-foreground font-semibold">Requested</th>
                    <th className="text-left py-3 px-4 text-foreground font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.pendingStudents.map((student) => (
                    <tr key={student.id} className="border-b border-primary/20 hover:bg-background/50 transition">
                      <td className="py-4 px-4 text-foreground">{student.name}</td>
                      <td className="py-4 px-4 text-foreground/70 font-mono text-sm">{student.email}</td>
                      <td className="py-4 px-4 text-foreground/70 text-sm">
                        {new Date(student.approvalRequestedAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproveStudent(student.id)}
                            className="px-4 py-2 bg-accent text-background font-semibold rounded-lg hover:neon-glow-lime transition text-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectStudent(student.id)}
                            className="px-4 py-2 bg-secondary/50 text-secondary font-semibold rounded-lg hover:bg-secondary/70 transition text-sm border border-secondary"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
   <AdminContentPage />
        {/* Filter and Students Table */}
        <div className="bg-card rounded-lg border border-primary/50 p-8 glow-border-cyan">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">Students</h2>
            <div className="flex gap-4">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filter === 'all'
                    ? 'bg-primary text-background glow-border-cyan'
                    : 'border border-primary/50 text-primary hover:bg-primary/10'
                }`}
              >
                All ({data?.students.length || 0})
              </button>
              <button
                onClick={() => setFilter('certificates')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filter === 'certificates'
                    ? 'bg-primary text-background glow-border-cyan'
                    : 'border border-primary/50 text-primary hover:bg-primary/10'
                }`}
              >
                Downloaded Cert. ({data?.students.filter((s) => s.certificatesDownloaded > 0).length || 0})
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary/30">
                  <th className="text-left py-4 px-4 font-semibold text-primary">Name</th>
                  <th className="text-left py-4 px-4 font-semibold text-primary">Email</th>
                  <th className="text-left py-4 px-4 font-semibold text-primary">Joined</th>
                  <th className="text-left py-4 px-4 font-semibold text-primary">Courses</th>
                  <th className="text-left py-4 px-4 font-semibold text-primary">Progress</th>
                  <th className="text-left py-4 px-4 font-semibold text-primary">Certs Downloaded</th>
                  <th className="text-left py-4 px-4 font-semibold text-primary">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, idx) => (
                  <tr
                    key={student.id}
                    className={`border-b border-primary/20 hover:bg-primary/5 transition ${
                      idx % 2 === 0 ? 'bg-background/50' : ''
                    }`}
                  >
                    <td className="py-4 px-4 text-foreground font-semibold">{student.name}</td>
                    <td className="py-4 px-4 text-foreground/80">{student.email}</td>
                    <td className="py-4 px-4 text-foreground/80">
                      {new Date(student.joinedAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-primary font-semibold">{student.totalCourses}</span>
                    </td>
                    <td className="py-4 px-4">
                      <ProgressBar value={student.overallProgress} />
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        student.certificatesDownloaded > 0
                          ? 'bg-accent/30 text-accent border border-accent/50'
                          : 'bg-muted/30 text-muted-foreground border border-muted/50'
                      }`}>
                        {student.certificatesDownloaded}/{student.totalCourses}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <DetailsPopup student={student} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12 text-foreground/50">
              No students found
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, color }: { title: string; value: string | number; color: string }) {
  const glowClass = color === 'cyan' ? 'neon-glow-cyan glow-border-cyan' :
                    color === 'magenta' ? 'neon-glow-magenta glow-border-magenta' :
                    'neon-glow-lime border border-accent'

  return (
    <div className={`bg-card p-6 rounded-lg border border-primary/30 ${glowClass}`}>
      <p className="text-foreground/70 text-sm font-semibold mb-2">{title}</p>
      <p className="text-3xl font-bold text-foreground">{value}</p>
    </div>
  )
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-24 h-2 bg-background/50 rounded-full overflow-hidden border border-primary/30">
      <div
        className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}

function DetailsPopup({ student }: { student: Student }) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="px-3 py-1 bg-primary/20 text-primary rounded hover:bg-primary/30 transition text-sm"
      >
        View
      </button>

      {showDetails && (
        <div className="absolute right-0 top-12 bg-card border border-primary/50 rounded-lg p-6 w-96 z-50 glow-border-cyan">
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-primary">{student.name}</h3>
            {student.courseProgress.map((course) => (
              <div key={course.courseId} className="border-t border-primary/20 pt-4">
                <p className="font-semibold text-foreground">{course.courseName}</p>
                <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-foreground/80">
                  <p>Lessons: {course.lessonsCompleted}</p>
                  <p>Exercises: {course.exercisesCompleted}</p>
                  <p>Score: {course.totalScore}%</p>
                  <p>
                    Cert:{' '}
                    {course.certificateDownloaded ? (
                      <span className="text-accent font-semibold">
                        Downloaded {new Date(course.certificateDownloadedAt!).toLocaleDateString()}
                      </span>
                    ) : course.certificateGenerated ? (
                      <span className="text-primary font-semibold">Generated</span>
                    ) : (
                      <span className="text-muted-foreground">Pending</span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowDetails(false)}
            className="mt-4 w-full py-2 bg-primary/20 text-primary rounded hover:bg-primary/30"
          >
            Close
          </button>
        </div>
      )}
   
    </div>
    
  )
}

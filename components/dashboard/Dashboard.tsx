'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import axios from 'axios'

interface Course {
  _id: string
  title: string
  icon: string
  description: string
  level: string
  lessons: Array<{ _id: string; title: string }>
}

interface UserProgress {
  courseId: string
  lessonsCompleted: string[]
  exercisesCompleted: Array<{ score: number }>
  totalScore: number
}

export default function Dashboard() {
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [progress, setProgress] = useState<Map<string, UserProgress>>(new Map())
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const userRes = await axios.get('/api/users/me')
      setUser(userRes.data.user)

      const coursesRes = await axios.get('/api/courses')
      setCourses(coursesRes.data.courses)

      const progressRes = await axios.get('/api/users/progress')
      const progressMap = new Map()
      progressRes.data.progress.forEach((p: any) => {
        progressMap.set(p.courseId, p)
      })
      setProgress(progressMap)
    } catch (error) {
      console.error('[v0] Failed to fetch data:', error)
      router.push('/auth/signin')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout')
      router.push('/')
    } catch (error) {
      console.error('[v0] Logout failed:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground/60">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b border-primary/30">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-2xl font-bold text-primary neon-glow-cyan">LearnHub</h1>
          <div className="flex items-center gap-4">
            <span className="text-foreground/70">Welcome, {user?.name}!</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-destructive font-semibold hover:bg-destructive/10 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-4xl font-bold text-foreground mb-2">My Courses</h2>
          <p className="text-foreground/60">Continue learning and track your progress</p>
        </motion.div>

        {courses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card border border-primary/30 p-12 rounded-xl text-center"
          >
            <p className="text-foreground/60 mb-4">No courses available yet.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:glow-border-cyan transition"
            >
              Refresh
            </button>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {courses.map((course) => {
              const courseProgress = progress.get(course._id)
              const lessonsCompleted = courseProgress?.lessonsCompleted.length || 0
              const totalLessons = course.lessons.length
              const progressPercent = totalLessons > 0 ? (lessonsCompleted / totalLessons) * 100 : 0
              const isCompleted = totalLessons > 0 && lessonsCompleted === totalLessons

              const destination = isCompleted
                ? `/certificate?courseId=${course._id}`
                : `/courses/${course._id}`

              return (
                <motion.div
                  key={course._id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`bg-card p-6 rounded-xl border cursor-pointer transition ${
                    isCompleted ? 'border-accent/50 shadow-[0_0_10px_rgba(57,255,20,0.3)]' : 'border-primary/30 hover:border-primary/60'
                  }`}
                >
                  <Link href={destination}>
                    <div className="text-5xl mb-4">{course.icon}</div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{course.title}</h3>
                    <p className="text-sm text-foreground/60 mb-4">{course.description}</p>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-foreground/60 mb-2">
                        <span>Progress</span>
                        <span>{lessonsCompleted}/{totalLessons}</span>
                      </div>
                      <motion.div
                        className="w-full bg-background rounded-full h-2 border border-primary/20"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                      >
                        <motion.div
                          className={`h-full rounded-full ${isCompleted ? 'bg-accent' : 'bg-primary'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ delay: 0.3, duration: 1 }}
                        ></motion.div>
                      </motion.div>
                    </div>

                    <button
                      className={`w-full py-2 rounded-lg transition text-sm font-semibold ${
                        isCompleted
                          ? 'bg-accent text-accent-foreground hover:shadow-[0_0_10px_rgba(57,255,20,0.3)]'
                          : 'bg-primary text-primary-foreground hover:glow-border-cyan'
                      }`}
                    >
                      {isCompleted ? 'View Certificate' : 'Continue Learning'}
                    </button>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </div>
  )
}
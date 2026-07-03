'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import axios from 'axios'

interface Lesson {
  _id: string
  title: string
  description: string
  content: string
  order: number
}

interface Course {
  _id: string
  title: string
  icon: string
  description: string
  level: string
  lessons: Lesson[]
}

interface Progress {
  lessonsCompleted: string[]
  exercisesCompleted: Array<{ exerciseId: string; score: number }>
  totalScore: number
}

export default function CourseDetail() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.courseId as string
  const [course, setCourse] = useState<Course | null>(null)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    fetchCourseAndProgress()
  }, [courseId])

  const fetchCourseAndProgress = async () => {
    try {
      const [courseRes, progressRes] = await Promise.all([
        axios.get(`/api/courses/${courseId}`),
        axios.get('/api/progress', { params: { courseId } }).catch(() => null),
      ])

      const courseData = sortCourseLessons(courseRes.data.course)
      const progressData: Progress = progressRes?.data?.progress || {
        lessonsCompleted: [],
        exercisesCompleted: [],
        totalScore: 0,
      }

      setCourse(courseData)
      setProgress(progressData)

      if (courseData.lessons.length > 0) {
        const completedIds = new Set(progressData.lessonsCompleted)
        const firstIncomplete = courseData.lessons.find((l: Lesson) => !completedIds.has(l._id))
        setSelectedLesson(firstIncomplete || courseData.lessons[0])
      }
    } catch (error) {
      console.error('[v0] Failed to fetch course:', error)
    } finally {
      setLoading(false)
    }
  }

  const sortCourseLessons = (courseData: Course): Course => ({
    ...courseData,
    lessons: [...courseData.lessons].sort((a, b) => a.order - b.order),
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground/60">Loading course...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-foreground/60 mb-4">Course not found</p>
          <Link href="/dashboard" className="text-primary hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const completedLessonIds = new Set(progress?.lessonsCompleted || [])

  let firstIncompleteSeen = false
  const lessonAccess = course.lessons.map((lesson) => {
    const isCompleted = completedLessonIds.has(lesson._id)
    let unlocked = false

    if (isCompleted) {
      unlocked = true
    } else if (!firstIncompleteSeen) {
      unlocked = true
      firstIncompleteSeen = true
    }

    return { lesson, isCompleted, unlocked }
  })

  const isLessonUnlocked = (lessonId: string) =>
    lessonAccess.find((l) => l.lesson._id === lessonId)?.unlocked ?? false

  const currentLessonIndex = course.lessons.findIndex((l) => l._id === selectedLesson?._id)
  const canGoNext =
    currentLessonIndex < course.lessons.length - 1 &&
    isLessonUnlocked(course.lessons[currentLessonIndex + 1]?._id)
  const canGoPrev = currentLessonIndex > 0

  const handleNextLesson = () => {
    if (canGoNext) {
      setSelectedLesson(course.lessons[currentLessonIndex + 1])
    }
  }

  const handlePrevLesson = () => {
    if (canGoPrev) {
      setSelectedLesson(course.lessons[currentLessonIndex - 1])
    }
  }

  const handleSelectLesson = (lesson: Lesson) => {
    if (!isLessonUnlocked(lesson._id)) return
    setSelectedLesson(lesson)
    setSidebarOpen(false)
  }

  const selectedLessonUnlocked = selectedLesson ? isLessonUnlocked(selectedLesson._id) : false

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="bg-card border-b border-primary/30 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-primary hover:underline">
              Back to Dashboard
            </Link>
            <span className="text-foreground/30">|</span>
            <span className="text-2xl">{course.icon}</span>
            <h1 className="text-2xl font-bold text-foreground">{course.title}</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            {sidebarOpen ? 'Hide' : 'Show'} Lessons
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto flex gap-8 p-8">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-80 flex-shrink-0`}
        >
          <div className="bg-card border border-primary/30 rounded-xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Lessons</h2>
            <div className="space-y-2">
              {lessonAccess.map(({ lesson, isCompleted, unlocked }, index) => (
                <motion.button
                  key={lesson._id}
                  onClick={() => handleSelectLesson(lesson)}
                  disabled={!unlocked}
                  whileHover={{ scale: unlocked ? 1.02 : 1 }}
                  whileTap={{ scale: unlocked ? 0.98 : 1 }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition border ${
                    !unlocked
                      ? 'bg-background border-primary/10 text-foreground/30 cursor-not-allowed'
                      : selectedLesson?._id === lesson._id
                        ? 'bg-primary text-primary-foreground border-primary'
                        : isCompleted
                          ? 'bg-accent/10 border-accent/30 text-foreground hover:bg-accent/20'
                          : 'bg-background border-primary/20 text-foreground hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="font-bold text-sm">
                      {isCompleted ? '✓' : !unlocked ? '🔒' : index + 1}
                    </span>
                    <div>
                      <p className="font-semibold">{lesson.title}</p>
                      <p className="text-xs opacity-70">{lesson.description}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        {selectedLesson && (
          <motion.div
            key={selectedLesson._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1"
          >
            <div className="bg-card border border-primary/30 rounded-xl p-8">
              {/* Lesson Header */}
              <div className="mb-8 pb-8 border-b border-primary/20">
                <h2 className="text-4xl font-bold text-foreground mb-2">{selectedLesson.title}</h2>
                <p className="text-foreground/60 text-lg">{selectedLesson.description}</p>
              </div>

              {/* Lesson Content */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="prose prose-invert prose-lg max-w-none mb-12"
              >
                <div className="text-foreground/80 whitespace-pre-wrap leading-relaxed">
                  {selectedLesson.content}
                </div>
              </motion.div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-8 border-t border-primary/20">
                <motion.button
                  onClick={handlePrevLesson}
                  disabled={!canGoPrev}
                  whileHover={{ scale: canGoPrev ? 1.05 : 1 }}
                  whileTap={{ scale: canGoPrev ? 0.95 : 1 }}
                  className="px-6 py-3 bg-card border border-primary/30 text-foreground rounded-lg font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary/60 transition"
                >
                  Previous Lesson
                </motion.button>

                {selectedLessonUnlocked ? (
                  <Link
                    href={`/exercises?courseId=${courseId}&lessonId=${selectedLesson._id}${
                      completedLessonIds.has(selectedLesson._id) ? '&review=true' : ''
                    }`}
                    className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:glow-border-magenta transition"
                  >
                    {completedLessonIds.has(selectedLesson._id) ? 'Review Exercises' : 'Start Exercises'}
                  </Link>
                ) : (
                  <span className="px-6 py-3 bg-background border border-primary/10 text-foreground/30 rounded-lg font-semibold cursor-not-allowed">
                    🔒 Complete previous lesson first
                  </span>
                )}

                <motion.button
                  onClick={handleNextLesson}
                  disabled={!canGoNext}
                  whileHover={{ scale: canGoNext ? 1.05 : 1 }}
                  whileTap={{ scale: canGoNext ? 0.95 : 1 }}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:glow-border-cyan transition"
                >
                  Next Lesson
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
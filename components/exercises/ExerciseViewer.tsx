'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import axios from 'axios'
import MultipleChoice from './MultipleChoice'
import CodeChallenge from './CodeChallenge'

interface Exercise {
  _id: string
  title: string
  content: any
  order: number
}

interface ExerciseScore {
  exerciseId: string
  score: number
  completedAt: string
}

export default function ExerciseViewer() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const courseId = searchParams.get('courseId')
  const lessonId = searchParams.get('lessonId')
  const isReviewMode = searchParams.get('review') === 'true'

  const [exercises, setExercises] = useState<Exercise[]>([])
  const [exerciseScores, setExerciseScores] = useState<Record<string, ExerciseScore>>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [completedCount, setCompletedCount] = useState(0)
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    loadExercisesAndProgress()
  }, [courseId, lessonId])

  const loadExercisesAndProgress = async () => {
    try {
      const [exercisesRes, progressRes] = await Promise.all([
        axios.get('/api/exercises', { params: { courseId, lessonId } }),
        axios.get('/api/progress', { params: { courseId } }).catch(() => null),
      ])

      const fetchedExercises: Exercise[] = exercisesRes.data.exercises
      const progress = progressRes?.data?.progress

      setExercises(fetchedExercises)

      const scoresByExerciseId: Record<string, ExerciseScore> = {}
      for (const e of progress?.exercisesCompleted || []) {
        const id = typeof e.exerciseId === 'string' ? e.exerciseId : e.exerciseId?.toString()
        if (id) scoresByExerciseId[id] = e
      }
      setExerciseScores(scoresByExerciseId)

      if (isReviewMode) {
        setLoading(false)
        return
      }

      if (progress) {
        if (lessonId && progress.lessonsCompleted?.includes(lessonId)) {
          setRedirecting(true)
          router.replace(`/courses/${courseId}`)
          return
        }

        const firstIncompleteIndex = fetchedExercises.findIndex(
          (ex) => !scoresByExerciseId[ex._id]
        )

        if (firstIncompleteIndex === -1) {
          setRedirecting(true)
          router.replace(`/courses/${courseId}`)
          return
        }

        setCurrentIndex(firstIncompleteIndex)
        setCompletedCount(firstIncompleteIndex)
      }
    } catch (error) {
      console.error('[v0] Failed to load exercises/progress:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground/60">{redirecting ? 'Lesson already completed, redirecting...' : 'Loading exercises...'}</p>
        </div>
      </div>
    )
  }

  if (exercises.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-foreground/60 mb-4">No exercises available</p>
          <Link href={`/courses/${courseId}`} className="text-primary hover:underline">
            Back to Course
          </Link>
        </div>
      </div>
    )
  }

  // --- Review mode: read-only summary of every exercise, no submission ---
  if (isReviewMode) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="bg-card border-b border-primary/30 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-8 py-4 flex justify-between items-center">
            <Link href={`/courses/${courseId}`} className="text-primary hover:underline">
              Back to Course
            </Link>
            <span className="text-foreground/70 font-semibold">Lesson Review</span>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-8 py-12 space-y-6">
          {exercises.map((exercise, index) => (
            <ReviewCard
              key={exercise._id}
              exercise={exercise}
              index={index}
              score={exerciseScores[exercise._id]}
            />
          ))}

          <Link
            href={`/courses/${courseId}`}
            className="block w-full text-center py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:glow-border-cyan transition"
          >
            Back to Course
          </Link>
        </div>
      </div>
    )
  }

  const currentExercise = exercises[currentIndex]
  const isLastExercise = currentIndex === exercises.length - 1
  const progress = ((currentIndex + 1) / exercises.length) * 100

  const handleExerciseComplete = async (score: number) => {
    const newCompletedCount = completedCount + 1
    setCompletedCount(newCompletedCount)

    try {
      await axios.post('/api/progress', {
        courseId,
        type: 'exercise',
        exerciseId: currentExercise._id,
        score,
      })

      if (isLastExercise && newCompletedCount === exercises.length && lessonId) {
        await axios.post('/api/progress', {
          courseId,
          type: 'lesson',
          lessonId,
        })
      }
    } catch (error) {
      console.error('[v0] Failed to save progress:', error)
    }
  }

  const handleNext = () => {
    if (!isLastExercise) {
      setCurrentIndex(currentIndex + 1)
    } else {
      router.push(`/courses/${courseId}`)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="bg-card border-b border-primary/30 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
          <Link href={`/courses/${courseId}`} className="text-primary hover:underline">
            Back to Course
          </Link>
          <span className="text-foreground/70 font-semibold">
            Exercise {currentIndex + 1} of {exercises.length}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-background h-2">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          ></motion.div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        <motion.div
          key={currentExercise._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-card border border-primary/30 rounded-xl p-8"
        >
          {currentExercise.content.type === 'multiple-choice' ? (
            <MultipleChoice
              exerciseId={currentExercise._id}
              question={currentExercise.content.question}
              options={currentExercise.content.options}
              correctAnswerIndex={currentExercise.content.correctAnswerIndex}
              explanation={currentExercise.content.explanation}
              onSubmit={handleExerciseComplete}
              onNext={handleNext}
            />
          ) : (
            <CodeChallenge
              exerciseId={currentExercise._id}
              title={currentExercise.content.title}
              description={currentExercise.content.description}
              initialCode={currentExercise.content.initialCode}
              solution={currentExercise.content.solution}
              testCases={currentExercise.content.testCases}
              onSubmit={handleExerciseComplete}
              onNext={handleNext}
            />
          )}
        </motion.div>

        {/* Completion Message */}
        {isLastExercise && completedCount === exercises.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-accent/10 border border-accent/40 rounded-lg p-8 text-center"
          >
            <p className="text-2xl font-bold text-accent mb-2">🎉 Excellent!</p>
            <p className="text-foreground/70 mb-6">You&apos;ve completed all exercises for this lesson.</p>
            <Link
              href={`/courses/${courseId}`}
              className="inline-block px-8 py-3 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition font-semibold"
            >
              Back to Course
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}

/**
 * Read-only card showing one exercise's question, the correct answer, and
 * the score the student got — used only in review mode. No submit logic.
 */
function ReviewCard({
  exercise,
  index,
  score,
}: {
  exercise: Exercise
  index: number
  score?: ExerciseScore
}) {
  const isMultipleChoice = exercise.content.type === 'multiple-choice'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="bg-card border border-primary/30 rounded-xl p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-sm font-semibold text-foreground/40">Exercise {index + 1}</span>
        {score !== undefined && (
          <span
            className={`text-sm font-bold px-3 py-1 rounded-full border ${
              score.score >= 80
                ? 'bg-accent/10 text-accent border-accent/40'
                : 'bg-secondary/10 text-secondary border-secondary/40'
            }`}
          >
            Score: {score.score}%
          </span>
        )}
      </div>

      {isMultipleChoice ? (
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4">{exercise.content.question}</h3>
          <div className="space-y-2 mb-4">
            {exercise.content.options.map((option: string, i: number) => (
              <div
                key={i}
                className={`p-3 rounded-lg border-2 ${
                  i === exercise.content.correctAnswerIndex
                    ? 'border-accent bg-accent/10'
                    : 'border-primary/20 bg-background'
                }`}
              >
                <div className="flex items-center gap-2">
                  {i === exercise.content.correctAnswerIndex && (
                    <span className="text-accent font-bold">✓</span>
                  )}
                  <span className={i === exercise.content.correctAnswerIndex ? 'font-semibold text-accent' : 'text-foreground/70'}>
                    {option}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {exercise.content.explanation && (
            <p className="text-sm text-foreground/70 bg-primary/5 border border-primary/20 rounded-lg p-3">
              {exercise.content.explanation}
            </p>
          )}
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-bold text-foreground mb-2">{exercise.content.title}</h3>
          <p className="text-foreground/70 mb-4 whitespace-pre-wrap">{exercise.content.description}</p>
          <p className="text-sm font-semibold text-foreground/80 mb-2">Correct solution:</p>
          <pre className="bg-background border border-primary/20 text-accent text-sm p-4 rounded-lg overflow-x-auto">
            <code>{exercise.content.solution}</code>
          </pre>
        </div>
      )}
    </motion.div>
  )
}
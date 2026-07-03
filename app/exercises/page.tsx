import ExerciseViewer from '@/components/exercises/ExerciseViewer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Exercises - LearnHub',
  description: 'Complete coding exercises and quizzes',
}

export default function ExercisesPage() {
  return <ExerciseViewer />
}

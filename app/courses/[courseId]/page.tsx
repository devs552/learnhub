import CourseDetail from '@/components/courses/CourseDetail'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Course - LearnHub',
  description: 'Learn from comprehensive course content',
}

export default function CoursePage() {
  return <CourseDetail />
}

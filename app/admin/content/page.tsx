'use client'

import { useEffect, useState } from 'react'
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
  description: string
  icon: string
  level: string
  lessons: Lesson[]
}

interface ExerciseContent {
  type: 'multiple-choice' | 'code-challenge'
  question?: string
  options?: string[]
  correctAnswerIndex?: number
  explanation?: string
  title?: string
  description?: string
  initialCode?: string
  solution?: string
  testCases?: Array<{ input: string; expectedOutput: string }>
}

interface Exercise {
  _id: string
  courseId: string
  lessonId: string
  title: string
  content: ExerciseContent
  order: number
}

export default function AdminContentPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null)
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null)
  const [exercisesByLesson, setExercisesByLesson] = useState<Record<string, Exercise[]>>({})

  const [showCourseForm, setShowCourseForm] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [lessonFormFor, setLessonFormFor] = useState<string | null>(null)
  const [editingLesson, setEditingLesson] = useState<{ courseId: string; lesson: Lesson } | null>(null)
  const [exerciseFormFor, setExerciseFormFor] = useState<{ courseId: string; lessonId: string } | null>(null)
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const res = await axios.get('/api/admin/courses')
      setCourses(res.data.courses)
    } catch (error) {
      console.error('[v0] Failed to fetch courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchExercises = async (lessonId: string) => {
    try {
      const res = await axios.get('/api/admin/exercises', { params: { lessonId } })
      setExercisesByLesson((prev) => ({ ...prev, [lessonId]: res.data.exercises }))
    } catch (error) {
      console.error('[v0] Failed to fetch exercises:', error)
    }
  }

  const toggleLesson = (lessonId: string) => {
    if (expandedLesson === lessonId) {
      setExpandedLesson(null)
    } else {
      setExpandedLesson(lessonId)
      if (!exercisesByLesson[lessonId]) fetchExercises(lessonId)
    }
  }

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Delete this course and all its lessons/exercises? This cannot be undone.')) return
    try {
      await axios.delete(`/api/admin/courses/${courseId}`)
      fetchCourses()
    } catch (error) {
      console.error('[v0] Failed to delete course:', error)
      alert('Failed to delete course')
    }
  }

  const handleDeleteLesson = async (courseId: string, lessonId: string) => {
    if (!confirm('Delete this lesson and all its exercises?')) return
    try {
      await axios.delete(`/api/admin/courses/${courseId}/lessons/${lessonId}`)
      fetchCourses()
    } catch (error) {
      console.error('[v0] Failed to delete lesson:', error)
      alert('Failed to delete lesson')
    }
  }

  const handleDeleteExercise = async (exerciseId: string, lessonId: string) => {
    if (!confirm('Delete this exercise?')) return
    try {
      await axios.delete(`/api/admin/exercises/${exerciseId}`)
      fetchExercises(lessonId)
    } catch (error) {
      console.error('[v0] Failed to delete exercise:', error)
      alert('Failed to delete exercise')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-2xl text-primary neon-glow-cyan">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-primary/50 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-8 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary neon-glow-cyan">Manage Content</h1>
          <button
            onClick={() => {
              setEditingCourse(null)
              setShowCourseForm(true)
            }}
            className="px-5 py-2 bg-primary text-background font-semibold rounded-lg hover:glow-border-cyan transition"
          >
            + New Course
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12 space-y-6">
        {courses.map((course) => (
          <div key={course._id} className="bg-card border border-primary/30 rounded-lg overflow-hidden">
            {/* Course header */}
            <div className="p-6 flex items-center justify-between">
              <button
                onClick={() => setExpandedCourse(expandedCourse === course._id ? null : course._id)}
                className="flex items-center gap-4 text-left flex-1"
              >
                <span className="text-3xl">{course.icon}</span>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{course.title}</h2>
                  <p className="text-sm text-foreground/60">
                    {course.lessons.length} lesson{course.lessons.length !== 1 ? 's' : ''} · {course.level}
                  </p>
                </div>
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingCourse(course)
                    setShowCourseForm(true)
                  }}
                  className="px-3 py-1.5 text-sm bg-primary/20 text-primary rounded hover:bg-primary/30 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCourse(course._id)}
                  className="px-3 py-1.5 text-sm bg-destructive/20 text-destructive rounded hover:bg-destructive/30 transition"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Lessons */}
            {expandedCourse === course._id && (
              <div className="border-t border-primary/20 p-6 space-y-3 bg-background/30">
                {[...course.lessons].sort((a, b) => a.order - b.order).map((lesson) => (
                  <div key={lesson._id} className="border border-primary/20 rounded-lg overflow-hidden">
                    <div className="p-4 flex items-center justify-between bg-card/50">
                      <button
                        onClick={() => toggleLesson(lesson._id)}
                        className="text-left flex-1"
                      >
                        <p className="font-semibold text-foreground">{lesson.title}</p>
                        <p className="text-xs text-foreground/60">{lesson.description}</p>
                      </button>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingLesson({ courseId: course._id, lesson })}
                          className="px-3 py-1 text-xs bg-primary/20 text-primary rounded hover:bg-primary/30 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteLesson(course._id, lesson._id)}
                          className="px-3 py-1 text-xs bg-destructive/20 text-destructive rounded hover:bg-destructive/30 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Exercises */}
                    {expandedLesson === lesson._id && (
                      <div className="p-4 border-t border-primary/10 space-y-2">
                        {(exercisesByLesson[lesson._id] || []).map((exercise) => (
                          <div
                            key={exercise._id}
                            className="flex items-center justify-between p-3 bg-background/50 rounded"
                          >
                            <div>
                              <p className="text-sm font-medium text-foreground">{exercise.title}</p>
                              <p className="text-xs text-foreground/50">{exercise.content.type}</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingExercise(exercise)}
                                className="px-3 py-1 text-xs bg-primary/20 text-primary rounded hover:bg-primary/30 transition"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteExercise(exercise._id, lesson._id)}
                                className="px-3 py-1 text-xs bg-destructive/20 text-destructive rounded hover:bg-destructive/30 transition"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={() => setExerciseFormFor({ courseId: course._id, lessonId: lesson._id })}
                          className="w-full py-2 text-sm border border-dashed border-primary/40 text-primary rounded hover:bg-primary/10 transition"
                        >
                          + Add Exercise
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => setLessonFormFor(course._id)}
                  className="w-full py-2 text-sm border border-dashed border-primary/40 text-primary rounded hover:bg-primary/10 transition"
                >
                  + Add Lesson
                </button>
              </div>
            )}
          </div>
        ))}

        {courses.length === 0 && (
          <div className="text-center py-16 text-foreground/50">No courses yet — create your first one above.</div>
        )}
      </div>

      {/* Forms */}
      {showCourseForm && (
        <CourseForm
          course={editingCourse}
          onClose={() => setShowCourseForm(false)}
          onSaved={() => {
            setShowCourseForm(false)
            fetchCourses()
          }}
        />
      )}

      {lessonFormFor && (
        <LessonForm
          courseId={lessonFormFor}
          lesson={null}
          onClose={() => setLessonFormFor(null)}
          onSaved={() => {
            setLessonFormFor(null)
            fetchCourses()
          }}
        />
      )}

      {editingLesson && (
        <LessonForm
          courseId={editingLesson.courseId}
          lesson={editingLesson.lesson}
          onClose={() => setEditingLesson(null)}
          onSaved={() => {
            setEditingLesson(null)
            fetchCourses()
          }}
        />
      )}

      {exerciseFormFor && (
        <ExerciseForm
          courseId={exerciseFormFor.courseId}
          lessonId={exerciseFormFor.lessonId}
          exercise={null}
          onClose={() => setExerciseFormFor(null)}
          onSaved={() => {
            fetchExercises(exerciseFormFor.lessonId)
            setExerciseFormFor(null)
          }}
        />
      )}

      {editingExercise && (
        <ExerciseForm
          courseId={editingExercise.courseId}
          lessonId={editingExercise.lessonId}
          exercise={editingExercise}
          onClose={() => setEditingExercise(null)}
          onSaved={() => {
            fetchExercises(editingExercise.lessonId)
            setEditingExercise(null)
          }}
        />
      )}
    </div>
  )
}

// ---------- Shared modal shell ----------
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-primary/50 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto glow-border-cyan">
        <div className="p-6 border-b border-primary/20 flex justify-between items-center sticky top-0 bg-card">
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
          <button onClick={onClose} className="text-foreground/60 hover:text-foreground text-xl leading-none">
            ×
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

const inputClass =
  'w-full px-3 py-2 bg-background border border-primary/30 rounded text-foreground focus:border-primary focus:outline-none'

// ---------- Course form ----------
function CourseForm({
  course,
  onClose,
  onSaved,
}: {
  course: Course | null
  onClose: () => void
  onSaved: () => void
}) {
  const [title, setTitle] = useState(course?.title || '')
  const [description, setDescription] = useState(course?.description || '')
  const [icon, setIcon] = useState(course?.icon || '')
  const [level, setLevel] = useState(course?.level || 'beginner')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async () => {
    setSaving(true)
    try {
      if (course) {
        await axios.put(`/api/admin/courses/${course._id}`, { title, description, icon, level })
      } else {
        await axios.post('/api/admin/courses', { title, description, icon, level })
      }
      onSaved()
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to save course')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title={course ? 'Edit Course' : 'New Course'} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-foreground/70 mb-1 block">Title</label>
          <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-foreground/70 mb-1 block">Description</label>
          <textarea className={inputClass} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-foreground/70 mb-1 block">Icon (emoji)</label>
          <input className={inputClass} value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="📚" />
        </div>
        <div>
          <label className="text-sm text-foreground/70 mb-1 block">Level</label>
          <select className={inputClass} value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving || !title || !description || !icon}
          className="w-full py-2.5 bg-primary text-background font-semibold rounded-lg hover:glow-border-cyan transition disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Course'}
        </button>
      </div>
    </Modal>
  )
}

// ---------- Lesson form ----------
function LessonForm({
  courseId,
  lesson,
  onClose,
  onSaved,
}: {
  courseId: string
  lesson: Lesson | null
  onClose: () => void
  onSaved: () => void
}) {
  const [title, setTitle] = useState(lesson?.title || '')
  const [description, setDescription] = useState(lesson?.description || '')
  const [content, setContent] = useState(lesson?.content || '')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async () => {
    setSaving(true)
    try {
      if (lesson) {
        await axios.put(`/api/admin/courses/${courseId}/lessons/${lesson._id}`, { title, description, content })
      } else {
        await axios.post(`/api/admin/courses/${courseId}/lessons`, { title, description, content })
      }
      onSaved()
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to save lesson')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title={lesson ? 'Edit Lesson' : 'New Lesson'} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-foreground/70 mb-1 block">Title</label>
          <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-foreground/70 mb-1 block">Description</label>
          <textarea className={inputClass} rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-foreground/70 mb-1 block">Content</label>
          <textarea className={inputClass} rows={8} value={content} onChange={(e) => setContent(e.target.value)} />
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving || !title || !description || !content}
          className="w-full py-2.5 bg-primary text-background font-semibold rounded-lg hover:glow-border-cyan transition disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Lesson'}
        </button>
      </div>
    </Modal>
  )
}

// ---------- Exercise form ----------
function ExerciseForm({
  courseId,
  lessonId,
  exercise,
  onClose,
  onSaved,
}: {
  courseId: string
  lessonId: string
  exercise: Exercise | null
  onClose: () => void
  onSaved: () => void
}) {
  const [type, setType] = useState<'multiple-choice' | 'code-challenge'>(
    exercise?.content.type || 'multiple-choice'
  )
  const [title, setTitle] = useState(exercise?.title || '')

  // multiple-choice fields
  const [question, setQuestion] = useState(exercise?.content.question || '')
  const [options, setOptions] = useState((exercise?.content.options || ['', '']).join('\n'))
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(exercise?.content.correctAnswerIndex ?? 0)
  const [explanation, setExplanation] = useState(exercise?.content.explanation || '')

  // code-challenge fields
  const [ccTitle, setCcTitle] = useState(exercise?.content.title || '')
  const [ccDescription, setCcDescription] = useState(exercise?.content.description || '')
  const [initialCode, setInitialCode] = useState(exercise?.content.initialCode || 'function solution() {\n  // Write your code here\n  return 0;\n}')
  const [solution, setSolution] = useState(exercise?.content.solution || 'function solution() {\n  return 0;\n}')
  const [testCasesText, setTestCasesText] = useState(
    (exercise?.content.testCases || [{ input: '', expectedOutput: '' }])
      .map((tc) => `${tc.input} => ${tc.expectedOutput}`)
      .join('\n')
  )

  const [saving, setSaving] = useState(false)

  const buildContent = (): ExerciseContent => {
    if (type === 'multiple-choice') {
      return {
        type: 'multiple-choice',
        question,
        options: options.split('\n').map((o) => o.trim()).filter(Boolean),
        correctAnswerIndex: Number(correctAnswerIndex),
        explanation,
      }
    }
    const testCases = testCasesText
      .split('\n')
      .map((line) => line.split('=>').map((s) => s.trim()))
      .filter(([input, output]) => input !== undefined && output !== undefined && input !== '')
      .map(([input, expectedOutput]) => ({ input, expectedOutput }))

    return {
      type: 'code-challenge',
      title: ccTitle,
      description: ccDescription,
      initialCode,
      solution,
      testCases,
    }
  }

  const handleSubmit = async () => {
    setSaving(true)
    try {
      const content = buildContent()
      if (exercise) {
        await axios.put(`/api/admin/exercises/${exercise._id}`, { title, content })
      } else {
        await axios.post('/api/admin/exercises', { courseId, lessonId, title, content })
      }
      onSaved()
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to save exercise')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title={exercise ? 'Edit Exercise' : 'New Exercise'} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-foreground/70 mb-1 block">Exercise title (internal label)</label>
          <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          <label className="text-sm text-foreground/70 mb-1 block">Type</label>
          <select
            className={inputClass}
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            disabled={!!exercise}
          >
            <option value="multiple-choice">Multiple Choice</option>
            <option value="code-challenge">Code Challenge</option>
          </select>
          {exercise && (
            <p className="text-xs text-foreground/40 mt-1">Type can't be changed after creation — delete and recreate instead.</p>
          )}
        </div>

        {type === 'multiple-choice' ? (
          <>
            <div>
              <label className="text-sm text-foreground/70 mb-1 block">Question</label>
              <textarea className={inputClass} rows={2} value={question} onChange={(e) => setQuestion(e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-foreground/70 mb-1 block">Options (one per line)</label>
              <textarea className={inputClass} rows={4} value={options} onChange={(e) => setOptions(e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-foreground/70 mb-1 block">Correct answer index (0-based)</label>
              <input
                type="number"
                min={0}
                className={inputClass}
                value={correctAnswerIndex}
                onChange={(e) => setCorrectAnswerIndex(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="text-sm text-foreground/70 mb-1 block">Explanation (shown if wrong)</label>
              <textarea className={inputClass} rows={2} value={explanation} onChange={(e) => setExplanation(e.target.value)} />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="text-sm text-foreground/70 mb-1 block">Challenge title</label>
              <input className={inputClass} value={ccTitle} onChange={(e) => setCcTitle(e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-foreground/70 mb-1 block">Description</label>
              <textarea className={inputClass} rows={3} value={ccDescription} onChange={(e) => setCcDescription(e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-foreground/70 mb-1 block">Starter code</label>
              <textarea className={`${inputClass} font-mono text-sm`} rows={5} value={initialCode} onChange={(e) => setInitialCode(e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-foreground/70 mb-1 block">Reference solution</label>
              <textarea className={`${inputClass} font-mono text-sm`} rows={5} value={solution} onChange={(e) => setSolution(e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-foreground/70 mb-1 block">
                Test cases — one per line, format: <code>input =&gt; expectedOutput</code>
              </label>
              <textarea
                className={`${inputClass} font-mono text-sm`}
                rows={4}
                value={testCasesText}
                onChange={(e) => setTestCasesText(e.target.value)}
                placeholder="[1,2] => 3"
              />
              <p className="text-xs text-foreground/40 mt-1">
                Input is parsed as JSON args for your solution function, e.g. <code>[1,2]</code> calls <code>solution(1, 2)</code>. Leave input blank for a no-arg call.
              </p>
            </div>
          </>
        )}

        <button
          onClick={handleSubmit}
          disabled={saving || !title}
          className="w-full py-2.5 bg-primary text-background font-semibold rounded-lg hover:glow-border-cyan transition disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Exercise'}
        </button>
      </div>
    </Modal>
  )
}
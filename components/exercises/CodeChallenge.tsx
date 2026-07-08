'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import dynamic from 'next/dynamic'

const Editor = dynamic(
  () => import('@monaco-editor/react').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="bg-card h-64 sm:h-96 rounded-lg flex items-center justify-center text-sm sm:text-base text-foreground/60 border border-primary/20">
        Loading editor...
      </div>
    ),
  }
)

interface CodeChallengeProps {
  exerciseId: string
  title: string
  description: string
  initialCode: string
  solution: string
  testCases: Array<{ input: string; expectedOutput: string }>
  onSubmit: (score: number) => void
  onNext: () => void
}

export default function CodeChallenge({
  exerciseId,
  title,
  description,
  initialCode,
  solution,
  testCases,
  onSubmit,
  onNext,
}: CodeChallengeProps) {
  const [code, setCode] = useState(initialCode)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)
  const [testResults, setTestResults] = useState<Array<{ passed: boolean; message: string }>>([])

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await axios.post('/api/exercises/submit', {
        exerciseId,
        answer: code,
      })

      setScore(res.data.score)
      setFeedback(res.data.feedback)
      setSubmitted(true)
      setTestResults(res.data.results || [])
      onSubmit(res.data.score)
    } catch (error) {
      console.error('[v0] Submission error:', error)
      setFeedback('Error submitting code')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setCode(initialCode)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-4 sm:space-y-6">
      {/* Problem Description */}
      <div className="bg-primary/5 border border-primary/30 rounded-lg p-4 sm:p-6">
        <h3 className="text-lg sm:text-2xl font-bold text-foreground mb-2">{title}</h3>
        <p className="text-sm sm:text-base text-foreground/70 whitespace-pre-wrap">{description}</p>
      </div>

      {/* Editor */}
      <div className="space-y-3">
        <h4 className="text-base sm:text-lg font-semibold text-foreground">Write Your Code</h4>
        <div className="rounded-lg overflow-hidden border border-primary/30">
          <Editor
            height="280px"
            defaultLanguage="javascript"
            defaultValue={initialCode}
            onChange={handleEditorChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              wordWrap: 'on',
              automaticLayout: true,
              scrollBeyondLastLine: false,
            }}
          />
        </div>
        <style jsx global>{`
          @media (min-width: 640px) {
            .monaco-editor-container {
              height: 400px !important;
            }
          }
        `}</style>
      </div>

      {/* Test Cases */}
      {testResults.length > 0 && submitted && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <h4 className="text-base sm:text-lg font-semibold text-foreground mb-3">Test Results</h4>
          <div className="space-y-2">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-l-4 ${
                  result.passed
                    ? 'bg-accent/10 border-accent'
                    : 'bg-destructive/10 border-destructive'
                }`}
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <span className={`text-base sm:text-lg font-bold flex-shrink-0 ${result.passed ? 'text-accent' : 'text-destructive'}`}>
                    {result.passed ? '✓' : '✗'}
                  </span>
                  <p className={`text-xs sm:text-sm ${result.passed ? 'text-accent' : 'text-destructive'}`}>{result.message}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Feedback */}
      {submitted && feedback && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-4 rounded-lg border ${
            score >= 80 ? 'bg-accent/10 border-accent/40' : 'bg-secondary/10 border-secondary/40'
          }`}
        >
          <p className={`text-sm font-semibold ${score >= 80 ? 'text-accent' : 'text-secondary'}`}>
            Score: {score}%
          </p>
          <p className="text-xs sm:text-sm mt-2 text-foreground/70">{feedback}</p>
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {!submitted ? (
          <>
            <motion.button
              onClick={handleReset}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 bg-card border border-primary/30 text-foreground text-sm sm:text-base font-semibold rounded-lg hover:border-primary/60 transition"
            >
              Reset Code
            </motion.button>
            <motion.button
              onClick={handleSubmit}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 bg-primary text-primary-foreground text-sm sm:text-base font-semibold rounded-lg hover:glow-border-cyan transition disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Code'}
            </motion.button>
          </>
        ) : (
          <motion.button
            onClick={onNext}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-secondary text-secondary-foreground text-sm sm:text-base font-semibold rounded-lg hover:glow-border-magenta transition"
          >
            Next Exercise
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
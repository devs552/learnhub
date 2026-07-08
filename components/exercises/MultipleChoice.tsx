'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'

interface MultipleChoiceProps {
  exerciseId: string
  question: string
  options: string[]
  correctAnswerIndex: number
  explanation: string
  onSubmit: (score: number) => void
  onNext: () => void
}

export default function MultipleChoice({
  exerciseId,
  question,
  options,
  correctAnswerIndex,
  explanation,
  onSubmit,
  onNext,
}: MultipleChoiceProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState('')

  const handleSubmit = async () => {
    if (selectedOption === null) return

    setLoading(true)
    try {
      const res = await axios.post('/api/exercises/submit', {
        exerciseId,
        answer: selectedOption.toString(),
      })

      setIsCorrect(res.data.isCorrect)
      setFeedback(res.data.feedback)
      setSubmitted(true)
      onSubmit(res.data.score)
    } catch (error) {
      console.error('[v0] Submission error:', error)
      if (axios.isAxiosError(error)) {
        console.error('[v0] Response data:', error.response?.data)
      }
      setFeedback('Error submitting answer')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6 sm:space-y-8">
      {/* Question */}
      <div>
        <h3 className="text-lg sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">{question}</h3>

        {/* Options */}
        <div className="space-y-3 sm:space-y-4">
          {options.map((option, index) => (
            <motion.button
              key={index}
              onClick={() => !submitted && setSelectedOption(index)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={submitted}
              className={`w-full p-3 sm:p-4 text-left rounded-lg border-2 transition ${
                selectedOption === index
                  ? 'border-primary bg-primary/10'
                  : 'border-primary/20 bg-card hover:border-primary/40'
              } ${submitted ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}
              ${submitted && index === correctAnswerIndex ? 'border-accent bg-accent/10' : ''}
              ${submitted && index !== correctAnswerIndex && selectedOption === index && !isCorrect ? 'border-destructive bg-destructive/10' : ''}`}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div
                  className={`w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 rounded-full border-2 flex items-center justify-center ${
                    selectedOption === index ? 'border-primary bg-primary' : 'border-primary/30'
                  } ${submitted && index === correctAnswerIndex ? 'border-accent bg-accent' : ''}
                  ${submitted && index !== correctAnswerIndex && selectedOption === index && !isCorrect ? 'border-destructive bg-destructive' : ''}`}
                >
                  {selectedOption === index && <span className="text-background text-xs sm:text-sm">✓</span>}
                  {submitted && index === correctAnswerIndex && <span className="text-background text-xs sm:text-sm">✓</span>}
                  {submitted && index !== correctAnswerIndex && selectedOption === index && !isCorrect && (
                    <span className="text-background text-xs sm:text-sm">✗</span>
                  )}
                </div>
                <span className="text-sm sm:text-lg text-foreground/90">{option}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Feedback */}
      {submitted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className={`p-4 rounded-lg border ${
            isCorrect ? 'bg-accent/10 border-accent/40' : 'bg-secondary/10 border-secondary/40'
          }`}
        >
          <p className={`text-sm font-semibold ${isCorrect ? 'text-accent' : 'text-secondary'}`}>
            {isCorrect ? '✓ Correct!' : 'Not quite right'}
          </p>
          <p className="text-xs sm:text-sm mt-2 text-foreground/70">{feedback}</p>
        </motion.div>
      )}

      {/* Submit Button */}
      {!submitted && (
        <motion.button
          onClick={handleSubmit}
          disabled={selectedOption === null || loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 bg-primary text-primary-foreground text-sm sm:text-base font-semibold rounded-lg hover:glow-border-cyan transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit Answer'}
        </motion.button>
      )}

      {/* Next Button */}
      {submitted && (
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
    </motion.div>
  )
}
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import axios from 'axios'

export default function SignUp() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const response = await axios.post('/api/auth/signup', {
        name,
        email,
        password,
      })

      if (response.status === 201) {
        router.push(`/approval-waiting?email=${encodeURIComponent(email)}`)
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to sign up')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background grid lg:grid-cols-2">
      {/* Left panel — form */}
      <div className="flex items-center justify-center p-8 order-2 lg:order-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 lg:hidden">
            <Link href="/" className="text-2xl font-bold neon-glow-magenta text-secondary">
              LearnHub
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Create Your Account</h1>
            <p className="text-foreground/60 mt-2">Start learning web development today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground/80 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-background border border-secondary/30 rounded-lg text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground/80 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-background border border-secondary/30 rounded-lg text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground/80 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-background border border-secondary/30 rounded-lg text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground/80 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-background border border-secondary/30 rounded-lg text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition"
                required
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 bg-destructive/10 border border-destructive/40 rounded-lg text-destructive text-sm"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-secondary text-secondary-foreground font-semibold py-3 rounded-lg hover:glow-border-magenta transition disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </motion.button>
          </form>

          <p className="text-center mt-6 text-foreground/60">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-secondary font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right panel — branding */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-card border-l border-secondary/30 relative overflow-hidden order-1 lg:order-2">
        <div className="absolute inset-0 bg-gradient-to-bl from-secondary/10 via-transparent to-accent/10 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 text-right"
        >
          <Link href="/" className="text-3xl font-bold neon-glow-magenta text-secondary">
            LearnHub
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative z-10 space-y-6 text-right ml-auto"
        >
          <h2 className="text-4xl font-bold text-foreground leading-tight">
            Start your <span className="text-secondary neon-glow-magenta">coding journey</span> today
          </h2>
          <p className="text-foreground/70 text-lg max-w-md ml-auto">
            Join thousands of students mastering HTML, CSS, JavaScript, and React through hands-on practice.
          </p>

          <div className="space-y-4 pt-4">
            {[
              { icon: '📝', text: 'Structured lessons from beginner to advanced' },
              { icon: '💻', text: 'Real code challenges graded automatically' },
              { icon: '🎓', text: 'Downloadable certificates when you finish' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center justify-end gap-3 text-foreground/80"
              >
                <span>{item.text}</span>
                <span className="text-2xl">{item.icon}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="relative z-10 text-sm text-foreground/40 text-right">
          Approval is quick — an admin reviews new accounts before access is granted.
        </div>
      </div>
    </div>
  )
}
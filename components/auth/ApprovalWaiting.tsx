'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

interface ApprovalWaitingProps {
  studentEmail: string
}

export default function ApprovalWaiting({ studentEmail }: ApprovalWaitingProps) {
  const router = useRouter()
  const [checkingStatus, setCheckingStatus] = useState(false)

  useEffect(() => {
    const checkApprovalStatus = async () => {
      setCheckingStatus(true)
      try {
        const res = await axios.get('/api/users/approval-status', {
          params: { email: studentEmail },
        })

        if (res.data.approvalStatus === 'approved') {
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('[v0] Error checking approval status:', error)
      } finally {
        setCheckingStatus(false)
      }
    }

    // Check status immediately and then every 5 seconds
    checkApprovalStatus()
    const interval = setInterval(checkApprovalStatus, 5000)

    return () => clearInterval(interval)
  }, [studentEmail, router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-6 py-12">
        <div className="bg-card border-2 border-primary/50 rounded-xl p-8 text-center">
          {/* Animated waiting icon */}
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full animate-pulse glow-border-cyan flex items-center justify-center text-4xl">
              ⏳
            </div>
          </div>

          <h1 className="text-3xl font-bold text-primary mb-4 neon-glow-cyan">
            Pending Approval
          </h1>

          <p className="text-foreground/80 mb-2">
            Welcome to LearnHub!
          </p>

          <p className="text-foreground/70 mb-6">
            Your enrollment request has been received. Our admin team is reviewing your application. You&apos;ll receive an email notification once your account is approved.
          </p>

          <div className="bg-background/50 border border-primary/30 rounded-lg p-4 mb-6">
            <p className="text-sm text-foreground/60 mb-1">Registered Email:</p>
            <p className="font-mono text-primary">{studentEmail}</p>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-accent text-lg">✓</span>
              <span className="text-foreground/70">Enrollment request submitted</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-muted-foreground">⧖</span>
              <span className="text-foreground/70">Awaiting admin approval</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-muted-foreground">✉</span>
              <span className="text-foreground/70">Email notification when approved</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-primary/20">
            <p className="text-xs text-muted-foreground">
              This page will auto-refresh every 5 seconds. Once approved, you&apos;ll be redirected to your dashboard.
            </p>
          </div>

          {checkingStatus && (
            <div className="mt-4 animate-pulse">
              <p className="text-primary text-sm">Checking approval status...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

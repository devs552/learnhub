'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ApprovalWaiting from '@/components/auth/ApprovalWaiting'

function ApprovalWaitingContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  return <ApprovalWaiting studentEmail={email} />
}

export default function ApprovalWaitingPage() {
  return (
    <Suspense fallback={null}>
      <ApprovalWaitingContent />
    </Suspense>
  )
}
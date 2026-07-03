'use client'

import { useSearchParams } from 'next/navigation'
import ApprovalWaiting from '@/components/auth/ApprovalWaiting'

export default function ApprovalWaitingPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  return <ApprovalWaiting studentEmail={email} />
}

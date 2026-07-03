import Dashboard from '@/components/dashboard/Dashboard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard - LearnHub',
  description: 'Manage your courses and track your learning progress',
}

export default function DashboardPage() {
  return <Dashboard />
}

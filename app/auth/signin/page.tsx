import SignIn from '@/components/auth/SignIn'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In - Learning Platform',
  description: 'Sign in to your learning account',
}

export default function SignInPage() {
  return <SignIn />
}

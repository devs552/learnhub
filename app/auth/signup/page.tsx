import SignUp from '@/components/auth/SignUp'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up - Learning Platform',
  description: 'Create a new learning account',
}

export default function SignUpPage() {
  return <SignUp />
}

'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import CertificateTemplate from '@/components/certificate/CertificateTemplate'
import axios from 'axios'

interface CertificateData {
  studentName: string
  courseName: string
  completionDate: string
  certificateId: string
}

function CertificateContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const courseId = searchParams.get('courseId')

  const [certificate, setCertificate] = useState<CertificateData | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [certificateId, setCertificateId] = useState<string | null>(null)

  useEffect(() => {
    if (courseId) {
      generateCertificate()
    }
  }, [courseId])

  const generateCertificate = async () => {
    setGenerating(true)
    try {
      const res = await axios.post('/api/certificates/generate', {
        courseId,
      })
      setCertificate(res.data.certificate)
      setCertificateId(res.data.certificateId)
    } catch (error) {
      console.error('[v0] Certificate generation error:', error)
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        alert(error.response.data.error)
        router.push(`/courses/${courseId}`)
      }
    } finally {
      setGenerating(false)
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    try {
      if (certificateId) {
        await axios.post('/api/certificates/download', {
          certificateId,
        })
      }
    } catch (error) {
      console.error('[v0] Download tracking error:', error)
    }
  }

  if (loading || generating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Generating your certificate...</p>
        </div>
      </div>
    )
  }

  if (!certificate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Unable to generate certificate</p>
          <Link href={`/courses/${courseId}`} className="text-indigo-600 hover:underline">
            Back to Course
          </Link>
        </div>
      </div>
    )
  }

  return <CertificateTemplate data={certificate} onDownload={handleDownload} />
}

export default function CertificatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <CertificateContent />
    </Suspense>
  )
}
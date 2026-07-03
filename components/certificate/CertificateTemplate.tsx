'use client'

import { motion } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

interface CertificateData {
  studentName: string
  courseName: string
  completionDate: string
  certificateId: string
}

interface CertificateTemplateProps {
  data: CertificateData
  onDownload?: () => void
}

export default function CertificateTemplate({ data, onDownload }: CertificateTemplateProps) {
  const certificateRef = useRef<HTMLDivElement>(null)
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showConfetti])

  const handleDownload = async () => {
    try {
      const html2canvas = (await import('html2canvas-pro')).default
      const jsPDF = (await import('jspdf')).jsPDF

      if (!certificateRef.current) return

      const canvas = await html2canvas(certificateRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
      })

      const pdf = new jsPDF('landscape', 'mm', 'a4')
      const imgData = canvas.toDataURL('image/png')
      pdf.addImage(imgData, 'PNG', 10, 10, 277, 190)
      pdf.save(`certificate-${data.certificateId}.pdf`)

      onDownload?.()
    } catch (error) {
      console.error('[v0] Download error:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Confetti Animation */}
      {showConfetti &&
        Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * window.innerWidth,
              y: -10,
              opacity: 1,
              rotate: 0,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 10,
              opacity: 0,
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              ease: 'easeIn',
            }}
            className="fixed pointer-events-none"
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: ['#00d4ff', '#ff006e', '#39ff14', '#ffd700', '#b300ff'][
                  Math.floor(Math.random() * 5)
                ],
              }}
            ></div>
          </motion.div>
        ))}

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full max-w-5xl"
      >
        {/* Certificate — kept light/gold intentionally: this is a printable
            achievement document, not app UI, and needs a light background
            for the PDF export to render correctly. */}
        <motion.div
          ref={certificateRef}
          initial={{ rotateX: -20 }}
          animate={{ rotateX: 0 }}
          transition={{ duration: 1 }}
          className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-2xl p-12 mb-8"
          style={{
            borderTop: '8px solid #FFD700',
            borderBottom: '8px solid #FFD700',
          }}
        >
          <div className="text-center space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="text-6xl mb-2">🏆</div>
              <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 mb-2">
                Certificate of Achievement
              </h1>
              <div className="h-1 w-32 bg-gradient-to-r from-amber-400 to-orange-400 mx-auto"></div>
            </motion.div>

            {/* Body */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="space-y-6"
            >
              <p className="text-xl text-gray-600">This certifies that</p>

              <motion.p
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="text-4xl font-bold text-gray-900"
              >
                {data.studentName}
              </motion.p>

              <p className="text-lg text-gray-700">has successfully completed the course</p>

              <motion.p
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="text-3xl font-bold text-indigo-600"
              >
                {data.courseName}
              </motion.p>

              <p className="text-gray-600">
                Demonstrating excellence in web development and technical proficiency
              </p>
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="pt-8 border-t-2 border-gray-300"
            >
              <div className="grid grid-cols-3 gap-8 mb-6">
                <div className="text-center">
                  <p className="text-gray-600 text-sm">Date</p>
                  <p className="text-gray-900 font-semibold">{data.completionDate}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-sm">Certificate ID</p>
                  <p className="text-gray-900 font-mono text-xs">{data.certificateId}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-sm">LearnHub</p>
                  <p className="text-gray-900 font-semibold">Certified</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                This certificate is an official recognition of achievement. ID: {data.certificateId}
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Action Buttons — these are app UI, so they follow the theme */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.5 }}
          className="flex gap-4 justify-center"
        >
          <motion.button
            onClick={handleDownload}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:glow-border-cyan transition"
          >
            Download Certificate
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-card border border-primary/30 text-foreground font-semibold rounded-lg hover:border-primary/60 transition"
          >
            Share Certificate
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}
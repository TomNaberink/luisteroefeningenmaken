'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import QuizComponent from '@/components/QuizComponent'

function QuizPageContent() {
  const searchParams = useSearchParams()
  const text = searchParams.get('text') || ''
  const audioUrl = searchParams.get('audio') || ''

  if (!text || !audioUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-800 mb-4">❌ Geen quiz data gevonden</h1>
          <p className="text-red-600 mb-6">Er is geen tekst of audio beschikbaar voor de quiz.</p>
          <a href="/luisteroefening" className="text-blue-600 hover:text-blue-800 underline">
            Ga terug naar luisteroefening
          </a>
        </div>
      </div>
    )
  }

  return <QuizComponent text={text} audioUrl={audioUrl} />
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-700">Quiz wordt geladen...</p>
        </div>
      </div>
    }>
      <QuizPageContent />
    </Suspense>
  )
}
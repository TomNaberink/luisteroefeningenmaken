'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

interface Question {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface QuizComponentProps {
  text: string
  audioUrl: string
}

export default function QuizComponent({ text, audioUrl }: QuizComponentProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [score, setScore] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([])
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [error, setError] = useState('')

  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  
  const audioRef = useRef<HTMLAudioElement>(null)

  // Audio player effects
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [audioUrl])

  // Generate quiz on component mount
  useEffect(() => {
    generateQuiz()
  }, [text])

  const generateQuiz = async () => {
    setIsGeneratingQuiz(true)
    setError('')

    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error(`Quiz generatie mislukt: ${response.status}`)
      }

      const data = await response.json()
      setQuestions(data.questions)
      setAnsweredQuestions(new Array(data.questions.length).fill(false))
    } catch (error) {
      console.error('Quiz generation error:', error)
      setError('Fout bij quiz generatie: ' + (error instanceof Error ? error.message : 'Onbekende fout'))
    } finally {
      setIsGeneratingQuiz(false)
    }
  }

  // Audio player functions
  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const seekTo = (time: number) => {
    const audio = audioRef.current
    if (!audio) return
    
    audio.currentTime = time
    setCurrentTime(time)
  }

  const skipBackward = () => {
    const audio = audioRef.current
    if (!audio) return
    
    const newTime = Math.max(0, audio.currentTime - 10)
    seekTo(newTime)
  }

  const skipForward = () => {
    const audio = audioRef.current
    if (!audio) return
    
    const newTime = Math.min(duration, audio.currentTime + 10)
    seekTo(newTime)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleVolumeChange = (newVolume: number) => {
    const audio = audioRef.current
    if (!audio) return
    
    audio.volume = newVolume
    setVolume(newVolume)
  }

  // Quiz functions
  const handleAnswerSelect = (answerIndex: number) => {
    if (showFeedback) return
    setSelectedAnswer(answerIndex)
  }

  const submitAnswer = () => {
    if (selectedAnswer === null) return

    const currentQuestion = questions[currentQuestionIndex]
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer

    if (isCorrect) {
      setScore(score + 1)
    }

    setShowFeedback(true)
    
    // Mark question as answered
    const newAnsweredQuestions = [...answeredQuestions]
    newAnsweredQuestions[currentQuestionIndex] = true
    setAnsweredQuestions(newAnsweredQuestions)
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
    } else {
      setQuizCompleted(true)
    }
  }

  const restartQuiz = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowFeedback(false)
    setScore(0)
    setAnsweredQuestions(new Array(questions.length).fill(false))
    setQuizCompleted(false)
  }

  if (isGeneratingQuiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-blue-800 mb-2">🧠 Quiz wordt gemaakt...</h2>
          <p className="text-blue-600">Even geduld, ik maak 10 vragen voor je!</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-800 mb-4">❌ Fout bij quiz maken</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <Link 
            href="/luisteroefening"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Terug naar luisteroefening
          </Link>
        </div>
      </div>
    )
  }

  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100)
    const passed = score >= 7

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className={`p-8 rounded-2xl shadow-xl ${passed ? 'bg-green-50 border-4 border-green-200' : 'bg-red-50 border-4 border-red-200'}`}>
              <div className="text-8xl mb-6">
                {passed ? '🎉' : '😢'}
              </div>
              
              <h1 className={`text-4xl font-bold mb-4 ${passed ? 'text-green-800' : 'text-red-800'}`}>
                {passed ? 'Gefeliciteerd!' : 'Helaas...'}
              </h1>
              
              <div className={`text-6xl font-bold mb-4 ${passed ? 'text-green-600' : 'text-red-600'}`}>
                {score}/10
              </div>
              
              <div className={`text-2xl mb-6 ${passed ? 'text-green-700' : 'text-red-700'}`}>
                {percentage}% correct
              </div>
              
              {passed ? (
                <div className="space-y-4">
                  <p className="text-green-800 text-lg font-semibold">
                    🌟 Fantastisch! Je hebt de luisteroefening succesvol afgerond!
                  </p>
                  <p className="text-green-700">
                    Je luistervaardigheden zijn uitstekend. Blijf zo doorgaan!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-red-800 text-lg font-semibold">
                    📚 Je moet nog wat meer oefenen...
                  </p>
                  <p className="text-red-700">
                    Geen zorgen! Luister de tekst nog een keer goed en probeer de quiz opnieuw.
                  </p>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <button
                  onClick={restartQuiz}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  🔄 Quiz opnieuw doen
                </button>
                
                <Link 
                  href="/luisteroefening"
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
                >
                  📝 Nieuwe tekst
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-blue-700">Geen vragen beschikbaar...</p>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/luisteroefening"
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Terug
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-800">
            🧠 Luisterquiz
          </h1>
          
          <div className="text-right">
            <div className="text-sm text-gray-600">Score</div>
            <div className="text-2xl font-bold text-blue-600">{score}/10</div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Audio Player */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              🎧 Luister zo vaak als je wilt
            </h2>

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
              <audio ref={audioRef} src={audioUrl} preload="metadata" />
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <div 
                  className="w-full h-2 bg-gray-200 rounded-full cursor-pointer"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const percent = (e.clientX - rect.left) / rect.width
                    seekTo(percent * duration)
                  }}
                >
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={skipBackward}
                  className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
                  title="10 seconden terug"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                  </svg>
                </button>

                <button
                  onClick={togglePlayPause}
                  className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  {isPlaying ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                </button>

                <button
                  onClick={skipForward}
                  className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
                  title="10 seconden vooruit"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Quiz Question */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Progress */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-gray-600">
                Vraag {currentQuestionIndex + 1} van {questions.length}
              </div>
              <div className="flex space-x-1">
                {questions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index < currentQuestionIndex ? 'bg-green-500' :
                      index === currentQuestionIndex ? 'bg-blue-500' :
                      'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Question */}
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              {currentQuestion.question}
            </h3>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showFeedback}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    showFeedback
                      ? index === currentQuestion.correctAnswer
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : index === selectedAnswer && index !== currentQuestion.correctAnswer
                        ? 'border-red-500 bg-red-50 text-red-800'
                        : 'border-gray-200 bg-gray-50 text-gray-600'
                      : selectedAnswer === index
                      ? 'border-blue-500 bg-blue-50 text-blue-800'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center">
                    <span className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center text-sm font-bold ${
                      showFeedback
                        ? index === currentQuestion.correctAnswer
                          ? 'border-green-500 bg-green-500 text-white'
                          : index === selectedAnswer && index !== currentQuestion.correctAnswer
                          ? 'border-red-500 bg-red-500 text-white'
                          : 'border-gray-300 text-gray-500'
                        : selectedAnswer === index
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-300 text-gray-500'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                  </div>
                </button>
              ))}
            </div>

            {/* Feedback */}
            {showFeedback && (
              <div className={`p-4 rounded-lg mb-6 ${
                selectedAnswer === currentQuestion.correctAnswer
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className={`font-bold mb-2 ${
                  selectedAnswer === currentQuestion.correctAnswer
                    ? 'text-green-800'
                    : 'text-red-800'
                }`}>
                  {selectedAnswer === currentQuestion.correctAnswer ? '✅ Correct!' : '❌ Fout!'}
                </div>
                <p className={`text-sm ${
                  selectedAnswer === currentQuestion.correctAnswer
                    ? 'text-green-700'
                    : 'text-red-700'
                }`}>
                  {currentQuestion.explanation}
                </p>
              </div>
            )}

            {/* Action Button */}
            <div className="flex justify-end">
              {!showFeedback ? (
                <button
                  onClick={submitAnswer}
                  disabled={selectedAnswer === null}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  Antwoord controleren
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Volgende vraag' : 'Quiz afronden'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
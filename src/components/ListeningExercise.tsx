'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

export default function ListeningExercise() {
  const [text, setText] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false)
  const [error, setError] = useState('')
  
  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Update current time
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

  const handleFileUpload = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.docx') && !file.name.toLowerCase().endsWith('.txt')) {
      setError('Alleen .docx en .txt bestanden zijn toegestaan!')
      return
    }

    setIsUploading(true)
    setError('')

    try {
      if (file.name.toLowerCase().endsWith('.txt')) {
        const fileText = await file.text()
        setText(fileText.trim())
      } else {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload-docx', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Upload failed')
        }

        const data = await response.json()
        setText(data.content)
      }
    } catch (error) {
      console.error('Upload error:', error)
      setError('Fout bij uploaden: ' + (error instanceof Error ? error.message : 'Onbekende fout'))
    } finally {
      setIsUploading(false)
    }
  }

  const generateAudio = async () => {
    if (!text.trim()) return

    setIsGeneratingAudio(true)
    setError('')

    try {
      const response = await fetch('/api/generate-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          voiceName: 'Kore', // Vaste stem
          multiSpeaker: false
        }),
      })

      if (!response.ok) {
        throw new Error(`Audio generatie mislukt: ${response.status}`)
      }

      const audioBlob = await response.blob()
      const url = URL.createObjectURL(audioBlob)
      setAudioUrl(url)
    } catch (error) {
      console.error('Audio generation error:', error)
      setError('Fout bij audio generatie: ' + (error instanceof Error ? error.message : 'Onbekende fout'))
    } finally {
      setIsGeneratingAudio(false)
    }
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/"
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Terug naar home
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-800">
            🎧 Luisteroefening Maken
          </h1>
          
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Step 1: Upload/Paste Text */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 text-blue-600 font-bold">
                1
              </span>
              Upload of plak je tekst
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* File Upload */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700">📁 Bestand uploaden</h3>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-700 font-medium">Klik om bestand te kiezen</p>
                      <p className="text-gray-500 text-sm">Word (.docx) of Tekst (.txt)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Paste */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700">✏️ Tekst plakken</h3>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Plak hier je tekst..."
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            {isUploading && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-blue-700 text-sm">Bestand wordt verwerkt...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".docx,.txt"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  handleFileUpload(file)
                }
                e.target.value = ''
              }}
              className="hidden"
            />
          </div>

          {/* Step 2: Generate Audio */}
          {text.trim() && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3 text-green-600 font-bold">
                  2
                </span>
                Maak luisteroefening
              </h2>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">Je tekst:</h3>
                <div className="text-sm text-gray-600 mb-2">
                  {text.trim().split(/\s+/).length} woorden
                </div>
                <div className="max-h-32 overflow-y-auto text-gray-700 text-sm leading-relaxed">
                  {text}
                </div>
              </div>

              <button
                onClick={generateAudio}
                disabled={isGeneratingAudio}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {isGeneratingAudio ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Audio wordt gemaakt...
                  </span>
                ) : (
                  '🎤 Maak Luisteroefening'
                )}
              </button>
            </div>
          )}

          {/* Step 3: Audio Player */}
          {audioUrl && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3 text-purple-600 font-bold">
                  3
                </span>
                Luister en oefen
              </h2>

              {/* Audio Player */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
                <audio ref={audioRef} src={audioUrl} preload="metadata" />
                
                {/* Progress Bar */}
                <div className="mb-6">
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
                <div className="flex items-center justify-center space-x-4 mb-4">
                  {/* Skip Backward */}
                  <button
                    onClick={skipBackward}
                    className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
                    title="10 seconden terug"
                  >
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                    </svg>
                  </button>

                  {/* Play/Pause */}
                  <button
                    onClick={togglePlayPause}
                    className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    {isPlaying ? (
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                      </svg>
                    ) : (
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    )}
                  </button>

                  {/* Skip Forward */}
                  <button
                    onClick={skipForward}
                    className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
                    title="10 seconden vooruit"
                  >
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                    </svg>
                  </button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center justify-center space-x-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M8.464 15.536a5 5 0 01-7.072 0M4.222 4.222a9 9 0 000 14.142M12 18a6 6 0 100-12 6 6 0 000 12z" />
                  </svg>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-gray-600 w-8">{Math.round(volume * 100)}%</span>
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">💡 Tips voor je luisteroefening:</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Luister eerst de hele tekst zonder mee te lezen</li>
                  <li>• Gebruik de terugspoelknop om moeilijke delen opnieuw te beluisteren</li>
                  <li>• Probeer de hoofdpunten te onthouden</li>
                  <li>• Lees daarna de tekst en vergelijk met wat je gehoord hebt</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
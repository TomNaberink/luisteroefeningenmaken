import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M8.464 15.536a5 5 0 01-7.072 0M4.222 4.222a9 9 0 000 14.142M12 18a6 6 0 100-12 6 6 0 000 12z" />
            </svg>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            🎧 Luisteroefening Maker
          </h1>
          
          <p className="text-xl text-blue-700 mb-6">
            Voor VMBO jaar 4 leerlingen
          </p>
          
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Upload een tekst of plak deze hieronder. Wij maken er automatisch een luisteroefening van 
            met hoogwaardige AI-spraak!
          </p>
        </div>

        {/* Main Action */}
        <div className="max-w-2xl mx-auto">
          <Link 
            href="/luisteroefening"
            className="block w-full"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer border-2 border-transparent hover:border-blue-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  Start je Luisteroefening
                </h2>
                
                <p className="text-gray-600 mb-6">
                  Klik hier om een tekst te uploaden en er een luisteroefening van te maken
                </p>
                
                <div className="inline-flex items-center text-blue-600 font-semibold">
                  <span>Begin nu</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📄</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Upload Tekst</h3>
            <p className="text-gray-600 text-sm">
              Upload Word-bestanden of plak tekst direct
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">AI Spraak</h3>
            <p className="text-gray-600 text-sm">
              Automatisch omzetten naar natuurlijke spraak
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎧</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Luister & Oefen</h3>
            <p className="text-gray-600 text-sm">
              Oefen je luistervaardigheden met de audiospeler
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-gray-500">
            Gemaakt met ❤️ voor het onderwijs • Powered by Gemini AI
          </p>
        </div>
      </div>
    </div>
  )
}
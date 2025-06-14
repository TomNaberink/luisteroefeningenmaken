import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    // Check API key
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found in environment variables')
      return NextResponse.json(
        { 
          error: 'API configuratie ontbreekt. Check Environment Variables.',
          hint: 'Voeg GEMINI_API_KEY toe aan je environment variables'
        }, 
        { status: 500 }
      )
    }

    // Parse request data
    const body = await request.json()
    const { text } = body

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Tekst is vereist en moet een string zijn' },
        { status: 400 }
      )
    }

    if (text.length < 100) {
      return NextResponse.json(
        { error: 'Tekst moet minimaal 100 karakters bevatten voor een goede quiz' },
        { status: 400 }
      )
    }

    // Detect language of the text
    const languageDetectionPrompt = `
Detecteer de taal van deze tekst en geef alleen de taalcode terug (nl, en, de, fr, etc.):

"${text.substring(0, 200)}..."
`

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    
    const languageResult = await model.generateContent(languageDetectionPrompt)
    const detectedLanguage = languageResult.response.text().trim().toLowerCase()
    
    console.log('Detected language:', detectedLanguage)

    // Create language-specific quiz prompt
    const getQuizPrompt = (language: string) => {
      switch (language) {
        case 'nl':
          return `
Maak een quiz van 10 multiple choice vragen over de volgende tekst. De quiz moet in het Nederlands zijn.

BELANGRIJKE REGELS:
1. Elke vraag moet 4 antwoordopties hebben (A, B, C, D)
2. Slechts 1 antwoord is correct
3. Vragen moeten over de INHOUD van de tekst gaan
4. Varieer tussen feitenvragen, begrip en conclusies
5. Maak vragen geschikt voor VMBO jaar 4 niveau
6. Geef bij elke vraag een korte uitleg waarom het antwoord correct is

Geef het antwoord in dit EXACTE JSON formaat:
{
  "questions": [
    {
      "question": "Vraag hier?",
      "options": ["Optie A", "Optie B", "Optie C", "Optie D"],
      "correctAnswer": 0,
      "explanation": "Uitleg waarom dit antwoord correct is."
    }
  ]
}

TEKST:
${text}
`

        case 'en':
          return `
Create a quiz of 10 multiple choice questions about the following text. The quiz must be in English.

IMPORTANT RULES:
1. Each question must have 4 answer options (A, B, C, D)
2. Only 1 answer is correct
3. Questions must be about the CONTENT of the text
4. Vary between factual questions, comprehension and conclusions
5. Make questions suitable for secondary school level
6. Provide a brief explanation for each question why the answer is correct

Give the answer in this EXACT JSON format:
{
  "questions": [
    {
      "question": "Question here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Explanation why this answer is correct."
    }
  ]
}

TEXT:
${text}
`

        case 'de':
          return `
Erstelle ein Quiz mit 10 Multiple-Choice-Fragen über den folgenden Text. Das Quiz muss auf Deutsch sein.

WICHTIGE REGELN:
1. Jede Frage muss 4 Antwortoptionen haben (A, B, C, D)
2. Nur 1 Antwort ist richtig
3. Fragen müssen über den INHALT des Textes gehen
4. Variiere zwischen Faktenfragen, Verständnis und Schlussfolgerungen
5. Mache Fragen geeignet für Sekundarschulniveau
6. Gib bei jeder Frage eine kurze Erklärung, warum die Antwort richtig ist

Gib die Antwort in diesem EXAKTEN JSON-Format:
{
  "questions": [
    {
      "question": "Frage hier?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Erklärung, warum diese Antwort richtig ist."
    }
  ]
}

TEXT:
${text}
`

        case 'fr':
          return `
Créez un quiz de 10 questions à choix multiples sur le texte suivant. Le quiz doit être en français.

RÈGLES IMPORTANTES:
1. Chaque question doit avoir 4 options de réponse (A, B, C, D)
2. Seulement 1 réponse est correcte
3. Les questions doivent porter sur le CONTENU du texte
4. Variez entre questions factuelles, compréhension et conclusions
5. Rendez les questions adaptées au niveau secondaire
6. Donnez une brève explication pour chaque question pourquoi la réponse est correcte

Donnez la réponse dans ce format JSON EXACT:
{
  "questions": [
    {
      "question": "Question ici?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Explication pourquoi cette réponse est correcte."
    }
  ]
}

TEXTE:
${text}
`

        default:
          // Default to Dutch if language not recognized
          return `
Maak een quiz van 10 multiple choice vragen over de volgende tekst. De quiz moet in het Nederlands zijn.

BELANGRIJKE REGELS:
1. Elke vraag moet 4 antwoordopties hebben (A, B, C, D)
2. Slechts 1 antwoord is correct
3. Vragen moeten over de INHOUD van de tekst gaan
4. Varieer tussen feitenvragen, begrip en conclusies
5. Maak vragen geschikt voor VMBO jaar 4 niveau
6. Geef bij elke vraag een korte uitleg waarom het antwoord correct is

Geef het antwoord in dit EXACTE JSON formaat:
{
  "questions": [
    {
      "question": "Vraag hier?",
      "options": ["Optie A", "Optie B", "Optie C", "Optie D"],
      "correctAnswer": 0,
      "explanation": "Uitleg waarom dit antwoord correct is."
    }
  ]
}

TEKST:
${text}
`
      }
    }

    const quizPrompt = getQuizPrompt(detectedLanguage)

    console.log('Generating quiz with Gemini...')
    
    const result = await model.generateContent(quizPrompt)
    const response = await result.response
    let quizText = response.text()

    console.log('Raw Gemini response:', quizText.substring(0, 500) + '...')

    // Clean up the response - remove markdown code blocks if present
    quizText = quizText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()

    // Try to parse the JSON
    let quizData
    try {
      quizData = JSON.parse(quizText)
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      console.error('Raw text:', quizText)
      
      // Try to extract JSON from the response if it's wrapped in other text
      const jsonMatch = quizText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        try {
          quizData = JSON.parse(jsonMatch[0])
        } catch (secondParseError) {
          throw new Error('Kon quiz data niet parsen uit Gemini response')
        }
      } else {
        throw new Error('Geen geldige JSON gevonden in Gemini response')
      }
    }

    // Validate the quiz structure
    if (!quizData.questions || !Array.isArray(quizData.questions)) {
      throw new Error('Ongeldige quiz structuur: geen questions array')
    }

    if (quizData.questions.length !== 10) {
      console.warn(`Expected 10 questions, got ${quizData.questions.length}`)
    }

    // Validate each question
    for (let i = 0; i < quizData.questions.length; i++) {
      const question = quizData.questions[i]
      
      if (!question.question || typeof question.question !== 'string') {
        throw new Error(`Vraag ${i + 1}: Ongeldige vraag tekst`)
      }
      
      if (!question.options || !Array.isArray(question.options) || question.options.length !== 4) {
        throw new Error(`Vraag ${i + 1}: Moet exact 4 antwoordopties hebben`)
      }
      
      if (typeof question.correctAnswer !== 'number' || question.correctAnswer < 0 || question.correctAnswer > 3) {
        throw new Error(`Vraag ${i + 1}: correctAnswer moet een nummer tussen 0 en 3 zijn`)
      }
      
      if (!question.explanation || typeof question.explanation !== 'string') {
        throw new Error(`Vraag ${i + 1}: Ongeldige uitleg`)
      }
    }

    console.log(`Quiz generated successfully with ${quizData.questions.length} questions`)

    return NextResponse.json({
      success: true,
      questions: quizData.questions,
      language: detectedLanguage,
      message: `Quiz succesvol gegenereerd met ${quizData.questions.length} vragen`
    })

  } catch (error: any) {
    console.error('Quiz generation error:', error)
    
    // Handle specific Gemini errors
    if (error.message?.includes('quota')) {
      return NextResponse.json(
        { 
          error: 'API quota bereikt. Probeer het later opnieuw.',
          details: 'Rate limit exceeded'
        },
        { status: 429 }
      )
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return NextResponse.json(
      { 
        error: 'Er is een fout opgetreden bij het genereren van de quiz',
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// Export available quiz info for frontend use
export async function GET() {
  return NextResponse.json({
    maxQuestions: 10,
    supportedLanguages: ['nl', 'en', 'de', 'fr'],
    questionTypes: [
      'Feitenvragen',
      'Begrip',
      'Conclusies',
      'Details',
      'Hoofdpunten'
    ],
    difficultyLevel: 'VMBO jaar 4'
  })
}
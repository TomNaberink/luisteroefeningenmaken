# 🎧 Luisteroefening Maker voor VMBO

Een web applicatie waarmee VMBO jaar 4 leerlingen teksten kunnen uploaden en omzetten naar hoogwaardige luisteroefeningen met AI-spraak.

## ✨ Functionaliteiten

### 📄 Tekst Input
- **Word Upload**: Upload .docx bestanden direct
- **Tekst Upload**: Upload .txt bestanden
- **Tekst Plakken**: Plak tekst direct in de interface
- **Tekst Bibliotheek**: Beheer meerdere teksten tegelijk

### 🎭 Geavanceerde Text-to-Speech
- **30 Gemini AI Stemmen**: Van Zephyr tot Sulafat met unieke karakteristieken
- **7 Emotie Stijlen**: Neutraal, Gelukkig, Enthousiast, Kalm, Professioneel, Vriendelijk, Informatief
- **Hoogwaardige Audio**: Gemini AI TTS voor natuurlijke spraak
- **Nederlandse Optimalisatie**: Speciaal afgestemd voor Nederlandse teksten

### 📚 Educatieve Features
- **Woordentelling**: Automatische telling van woorden
- **Luistertijd Schatting**: Berekening van geschatte luistertijd
- **Tekst Preview**: Bekijk de tekst tijdens het luisteren
- **Gebruiksvriendelijk**: Speciaal ontworpen voor VMBO-niveau

## 🚀 Quick Start

### Stap 1: Environment Setup
Maak een `.env.local` bestand aan:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Stap 2: API Key Verkrijgen
Ga naar [Google AI Studio](https://makersuite.google.com/app/apikey) om je gratis Gemini API key aan te maken.

### Stap 3: Installatie & Start
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in je browser.

## 🎯 Gebruik

1. **Upload Tekst**: Upload een Word-document, tekstbestand, of plak tekst
2. **Selecteer Tekst**: Kies welke tekst je wilt laten voorlezen
3. **Kies Stem**: Selecteer een van de 30 beschikbare stemmen
4. **Stel Emotie In**: Kies de juiste emotie voor de tekst
5. **Luister**: Klik op afspelen en oefen je luistervaardigheden!

## 🛠️ Technische Details

### Tech Stack
- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **AI**: Google Gemini 2.5 Flash voor TTS
- **Document Processing**: Mammoth.js voor Word-bestanden
- **Deployment**: Geoptimaliseerd voor Netlify

### Ondersteunde Formaten
- **Documenten**: .docx (Word), .txt (Tekst)
- **Audio Output**: WAV (24kHz, 16-bit)
- **Browsers**: Chrome, Firefox, Safari, Edge

### API Endpoints
- `POST /api/generate-tts` - Genereer audio van tekst
- `POST /api/upload-docx` - Verwerk Word-documenten
- `GET /api/generate-tts` - Beschikbare stemmen

## 🎓 Voor Docenten

### Voordelen
- **Geen Installatie**: Werkt direct in de browser
- **Offline Voorbereiding**: Upload teksten van tevoren
- **Kwaliteitscontrole**: Preview teksten voor gebruik
- **Flexibel**: Verschillende stemmen voor verschillende teksten

### Gebruik in de Klas
- **Individueel Oefenen**: Leerlingen kunnen zelfstandig oefenen
- **Groepsoefeningen**: Gebruik voor klassikale luisteroefeningen
- **Huiswerk**: Leerlingen kunnen thuis oefenen
- **Differentiatie**: Verschillende moeilijkheidsgraden

## 🔧 Development

### Project Structuur
```
src/
├── app/
│   ├── api/
│   │   ├── generate-tts/route.ts    # Gemini TTS endpoint
│   │   └── upload-docx/route.ts     # Document processing
│   ├── layout.tsx                   # App layout
│   └── page.tsx                     # Homepage
└── components/
    ├── TextToListening.tsx          # Main component
    └── GeminiTTS.tsx               # TTS component
```

### Environment Variables
```env
GEMINI_API_KEY=gai_xxxxxxxxxxxxx    # Google AI Studio
NODE_ENV=production                  # Auto-set door Netlify
```

## 🚀 Deployment

### Netlify (Aanbevolen)
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Add environment variables in Netlify dashboard
4. Deploy!

### Environment Variables in Netlify
- `GEMINI_API_KEY`: Je Gemini API key

## 💡 Toekomstige Features

- [ ] **Oefeningen Generator**: Automatische vragen bij teksten
- [ ] **Voortgang Tracking**: Bijhouden van gemaakte oefeningen
- [ ] **Moeilijkheidsgraad**: Automatische inschatting van tekstniveau
- [ ] **Woordenlijst**: Moeilijke woorden uitlichten
- [ ] **Snelheidscontrole**: Afspeelsnelheid aanpassen
- [ ] **Pauze Markers**: Automatische pauzes in lange teksten

## 🤝 Contributing

Suggesties en verbeteringen zijn welkom! Open een issue of pull request.

## 📄 License

MIT License - Vrij te gebruiken voor educatieve doeleinden.

---

**💜 Gemaakt voor het Nederlandse onderwijs**  
**🎓 Speciaal voor VMBO jaar 4 leerlingen**

*Versie 1.0 - Luisteroefening Maker*  
*Last updated: December 2024*
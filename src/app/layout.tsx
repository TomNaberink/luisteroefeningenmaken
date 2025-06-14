import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Luisteroefening Maker - VMBO',
  description: 'Maak luisteroefeningen van teksten voor VMBO jaar 4 leerlingen',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <body className="bg-gray-100 min-h-screen" suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  )
}
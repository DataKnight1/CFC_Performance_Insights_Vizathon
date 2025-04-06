import type React from "react"
import "./globals.css"
import "./print.css"
import { Inter, Oswald } from "next/font/google"

// Define fonts
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
})

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald"
})

export const metadata = {
  title: "CFC Performance Insights Vizathon",
  description: "Chelsea FC Performance Insights Visualization Challenge - Comprehensive player performance analytics for optimized decision-making",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable}`}>
      <head>
        <link rel="icon" href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-SvkMVEyEGNlML3C7t85UPpuMulsAEO.png" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
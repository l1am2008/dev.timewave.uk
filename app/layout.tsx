import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import Navigation from "@/components/navigation"
import RadioPlayer from "@/components/radio-player"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Timewave Radio",
  description: "Community radio station with live streaming",
  icons: {
    icon: "https://us-east-1.tixte.net/uploads/liam.needs.rest/TimewaveTransparent.png",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased bg-background text-foreground flex flex-col h-screen`}>
        <Navigation />
        <div className="flex-1 overflow-auto">{children}</div>
        <RadioPlayer />
        <Analytics />
      </body>
    </html>
  )
}

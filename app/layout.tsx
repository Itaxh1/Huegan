import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

// Body font - clean and readable
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

// Heading font - elegant and distinctive
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Huegan - Color Palette Generator by Ashwin Kumar",
  description: "Create beautiful and harmonious color palettes for your designs. Created by Ashwin Kumar Uma Sankar.",
  authors: [{ name: "Ashwin Kumar Uma Sankar", url: "https://ashxinkumar.me" }],
  creator: "Ashwin Kumar Uma Sankar",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfair.variable}`}>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="light" attribute="class">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

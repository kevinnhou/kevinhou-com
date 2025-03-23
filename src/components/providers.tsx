"use client"

import type { ReactNode } from "react"

import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ThemeProvider, useTheme } from "next-themes"
import { Toaster } from "sonner"

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      disableTransitionOnChange
      enableSystem
    >
      <ToasterProvider />
      {children}
      <Analytics />
      <SpeedInsights />
    </ThemeProvider>
  )
}

function ToasterProvider() {
  const { theme } = useTheme() as {
    theme: "dark" | "light" | "system"
  }
  return (
    <Toaster
      position="bottom-center"
      richColors
      theme={theme}
    />
  )
}

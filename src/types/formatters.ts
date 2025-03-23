import type { ReactNode } from "react"

export interface FormatterContext {
  isMultiLine: boolean
  lineIndex: number
}

export interface OutputFormatter {
  canFormat: (line: string) => boolean
  format: (line: string, context?: FormatterContext) => ReactNode
}

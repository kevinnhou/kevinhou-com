import type { FormatterContext, OutputFormatter } from "@/types/formatters"
import type React from "react"

export class TextFormatter implements OutputFormatter {
  canFormat(): boolean {
    return true
  }

  format(line: string, context?: FormatterContext): React.ReactNode {
    if (context?.isMultiLine) {
      return (
        <div className="mt-1 min-h-[1.2em]" key={context.lineIndex}>
          {line}
        </div>
      )
    }

    return <span key={context?.lineIndex || 0}>{line}</span>
  }
}

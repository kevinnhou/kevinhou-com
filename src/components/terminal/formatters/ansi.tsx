import type { FormatterContext, OutputFormatter } from "@/types/formatters"
import type React from "react"

interface ANSISegment {
  style: {
    backgroundColor?: string
    color?: string
    fontWeight?: string
    textDecoration?: string
  }
  text: string
}

const ANSI_CODES: { [key: string]: string } = {
  0: "reset",
  1: "bold",
  4: "underline",
  30: "black",
  31: "red",
  32: "green",
  33: "yellow",
  34: "blue",
  35: "magenta",
  36: "cyan",
  37: "white",
  40: "bg-black",
  41: "bg-red",
  42: "bg-green",
  43: "bg-yellow",
  44: "bg-blue",
  45: "bg-magenta",
  46: "bg-cyan",
  47: "bg-white",
  90: "gray",
}

const ANSI_COLORS: { [key: string]: string } = {
  "bg-black": "#2e3436",
  "bg-blue": "#3465a4",
  "bg-cyan": "#06989a",
  "bg-gray": "#555753",
  "bg-green": "#4e9a06",
  "bg-magenta": "#75507b",
  "bg-red": "#cc0000",
  "bg-white": "#d3d7cf",
  "bg-yellow": "#c4a000",
  "black": "#2e3436",
  "blue": "#3465a4",
  "cyan": "#06989a",
  "gray": "#555753",
  "green": "#4e9a06",
  "magenta": "#75507b",
  "red": "#cc0000",
  "white": "#d3d7cf",
  "yellow": "#c4a000",
}

export class AnsiFormatter implements OutputFormatter {
  canFormat(line: string): boolean {
    return line.includes("\u001B[") || line.includes("\x1B[")
  }

  format(line: string, context?: FormatterContext): React.ReactNode {
    const parsedLine = parseANSI(line)

    if (context?.isMultiLine) {
      return (
        <div className="mt-1 min-h-[1.2em]" key={context.lineIndex}>
          {parsedLine}
        </div>
      )
    }

    return parsedLine
  }
}

function parseANSI(text: string): React.ReactNode[] {
  const segments: ANSISegment[] = []
  const currentSegment: ANSISegment = {
    style: {},
    text: "",
  }

  // eslint-disable-next-line no-control-regex, regexp/no-unused-capturing-group
  const regex = /(\x1B)\[([\d;]*)m/g

  let lastIndex = 0
  let match: null | RegExpExecArray

  // eslint-disable-next-line no-cond-assign
  while ((match = regex.exec(text)) !== null) {
    const textBeforeMatch = text.substring(lastIndex, match.index)
    if (textBeforeMatch) {
      currentSegment.text = textBeforeMatch
      segments.push({ ...currentSegment })
      currentSegment.text = ""
    }

    const codes = match[2].split(";")

    if (codes.includes("0") || codes.length === 0) {
      currentSegment.style = {}
    }

    codes.forEach((code) => {
      if (!code)
        return

      const codeNum = Number.parseInt(code, 10)
      if (ANSI_CODES[codeNum]) {
        switch (ANSI_CODES[codeNum]) {
          case "bold":
            currentSegment.style.fontWeight = "bold"
            break
          case "reset":
            currentSegment.style = {}
            break
          case "underline":
            currentSegment.style.textDecoration = "underline"
            break
          default:
          { const colorType = ANSI_CODES[codeNum]
            if (colorType.startsWith("bg-")) {
              currentSegment.style.backgroundColor = ANSI_COLORS[colorType]
            }
            else if (ANSI_COLORS[colorType]) {
              currentSegment.style.color = ANSI_COLORS[colorType]
            } }
        }
      }
    })

    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    currentSegment.text = text.substring(lastIndex)
    segments.push({ ...currentSegment })
  }

  if (segments.length === 0 && text) {
    return [<span key="0">{text}</span>]
  }

  return segments.map((segment, index) => (
    <span key={index} style={segment.style}>
      {segment.text}
    </span>
  ))
}

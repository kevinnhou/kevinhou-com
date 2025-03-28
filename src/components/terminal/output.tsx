import type { ReactNode } from "react";

import { formatters } from "./formatters";

import type { FormatterContext } from "@/types/formatters";

export function formatOutput(content: string): ReactNode[] {
  const withNewLine = content.endsWith("\n") ? content : `${content}\n`;
  const isMultiLine = withNewLine.includes("\n");

  if (!isMultiLine) {
    for (const formatter of formatters) {
      if (formatter.canFormat(withNewLine)) {
        return [formatter.format(withNewLine)];
      }
    }
    return [<span key="0">{withNewLine}</span>];
  }

  const lines = withNewLine.split("\n");
  return lines.map((line, lineIndex) => {
    const context: FormatterContext = {
      isMultiLine: true,
      lineIndex,
    };

    for (const formatter of formatters) {
      if (formatter.canFormat(line)) {
        return formatter.format(line, context);
      }
    }

    return (
      <div className="mt-1 min-h-[1.2em]" key={lineIndex}>
        {line}
      </div>
    );
  });
}

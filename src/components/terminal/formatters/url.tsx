import Link from "next/link";
import type React from "react";

import type { FormatterContext, OutputFormatter } from "@/types/formatters";


export class UrlFormatter implements OutputFormatter {
  canFormat(line: string): boolean {
    return this.isUrl(line.trim());
  }

  format(line: string, context?: FormatterContext): React.ReactNode {
    const url = line.trim();

    if (context?.isMultiLine) {
      return (
        <div className="mt-1 min-h-[1.2em]" key={context.lineIndex}>
          <Link className="underline" href={url} target="_blank">
            {url}
          </Link>
        </div>
      );
    }

    return (
      <Link className="underline" href={url} key={context?.lineIndex || 0} target="_blank">
        {url}
      </Link>
    );
  }

  private isUrl(text: string): boolean {
    return /^https?:\/\/\S+$/.test(text);
  }
}

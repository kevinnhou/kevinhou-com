import type { Command, CommandResult } from "@/types/commands"

import { site } from "@/config/site"

export class WhoAmICommand implements Command {
  name = "whoami"

  execute(args: string[]): CommandResult {
    if (args.length > 0) {
      return {
        output: `usage: ${this.name}`,
        success: false,
      }
    }

    return {
      output: this.renderWhoAmI(),
      success: true,
    }
  }

  private renderWhoAmI(): string {
    const lines: string[] = []

    Object.values(site.links).forEach((url) => {
      lines.push(`${url}`)
    })

    return lines.join("\n")
  }
}

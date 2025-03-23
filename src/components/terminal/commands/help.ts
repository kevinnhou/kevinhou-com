import type { Command, CommandRegistry, CommandResult } from "@/types/commands"

export class HelpCommand implements Command {
  name = "help"
  private registry: CommandRegistry

  constructor(registry: CommandRegistry) {
    this.registry = registry
  }

  execute(args: string[]): CommandResult {
    const commands = this.registry.getCommands()

    if (args.length > 0) {
      return {
        output: `usage: ${this.name}`,
        success: false,
      }
    }

    const output = [
      "Available commands:",
      ...commands.map(cmd => `-  ${cmd.name.padEnd(10)}`),
    ].join("\n")

    return {
      output,
      success: true,
    }
  }
}

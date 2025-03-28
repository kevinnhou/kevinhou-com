import type { Command, CommandRegistry, CommandResult } from "@/types/commands";

export class TerminalCommandRegistry implements CommandRegistry {
  private commands: Map<string, Command> = new Map();

  async execute(
    commandLine: string,
    directory: string,
  ): Promise<CommandResult> {
    const parts = commandLine.trim().split(" ");
    const commandName = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (commandName === "") {
      return { output: "", success: true };
    }

    const command = this.commands.get(commandName);

    if (command) {
      try {
        return await Promise.resolve(command.execute(args, directory));
      } catch (error) {
        return {
          output: `Error executing command: ${error instanceof Error ? error.message : String(error)}`,
          success: false,
        };
      }
    }

    return {
      output: `kevinhou: command not found: ${commandName}`,
      success: false,
    };
  }

  getCommands(): Command[] {
    return Array.from(this.commands.values());
  }

  register(command: Command): void {
    this.commands.set(command.name, command);
  }
}

export interface Command {
  execute: (args: string[], directory: string) => CommandResult | Promise<CommandResult>
  name: string
}

export interface CommandRegistry {
  execute: (commandLine: string, directory: string) => Promise<CommandResult>
  getCommands: () => Command[]
  register: (command: Command) => void
}

export interface CommandResult {
  output: string
  success: boolean
}

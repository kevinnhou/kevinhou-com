import { ClearCommand } from "./clear";
import { HelpCommand } from "./help";
import { TerminalCommandRegistry } from "./registry";
import { WhoAmICommand } from "./whoami";

export function createCommandRegistry() {
  const registry = new TerminalCommandRegistry();

  registry.register(new ClearCommand());
  registry.register(new WhoAmICommand());

  const helpCommand = new HelpCommand(registry);
  registry.register(helpCommand);

  return registry;
}

export type { CommandResult } from "@/types/commands";
export { TerminalCommandRegistry };

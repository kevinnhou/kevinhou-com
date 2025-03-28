import type { Command, CommandResult } from "@/types/commands";

export class ClearCommand implements Command {
  name = "clear";

  execute(): CommandResult {
    return {
      output: "",
      success: true,
    };
  }
}

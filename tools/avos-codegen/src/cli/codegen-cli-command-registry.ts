import {
  CodeGenCliCommand,
} from "./codegen-cli.contracts";
import {
  CodeGenValidationError,
} from "../core/codegen.errors";

export class CodeGenCliCommandRegistry {
  private readonly commands =
    new Map<string, CodeGenCliCommand>();

  register(
    command: CodeGenCliCommand,
    replace = false,
  ): CodeGenCliCommand {
    if (
      this.commands.has(command.key) &&
      !replace
    ) {
      throw new CodeGenValidationError(
        `CLI command already exists: ${command.key}`,
      );
    }

    this.commands.set(command.key, command);

    for (const alias of command.aliases) {
      if (
        this.commands.has(alias) &&
        !replace
      ) {
        throw new CodeGenValidationError(
          `CLI command alias already exists: ${alias}`,
        );
      }

      this.commands.set(alias, command);
    }

    return command;
  }

  get(key: string): CodeGenCliCommand {
    const command = this.commands.get(key);

    if (!command) {
      throw new CodeGenValidationError(
        `CLI command was not found: ${key}`,
      );
    }

    return command;
  }

  list(): CodeGenCliCommand[] {
    const unique =
      new Map<string, CodeGenCliCommand>();

    for (const command of this.commands.values()) {
      unique.set(command.key, command);
    }

    return Array.from(unique.values())
      .sort((a, b) => a.key.localeCompare(b.key));
  }

  has(key: string): boolean {
    return this.commands.has(key);
  }

  clear(): void {
    this.commands.clear();
  }
}

import {
  CodeGenCliCommandRegistry,
} from "../codegen-cli-command-registry";
import {
  CodeGenCliArgumentParser,
} from "../parsing/codegen-cli-argument-parser";
import {
  CodeGenCliOutputFormatter,
} from "../formatting/codegen-cli-output-formatter";
import {
  CodeGenDoctorCommand,
} from "../commands/codegen-doctor.command";
import {
  CodeGenGenerateCommand,
} from "../commands/codegen-generate.command";
import {
  CodeGenHelpCommand,
} from "../commands/codegen-help.command";
import {
  CodeGenInspectCommand,
} from "../commands/codegen-inspect.command";
import {
  CodeGenListCommand,
} from "../commands/codegen-list.command";
import {
  CodeGenPreviewCommand,
} from "../commands/codegen-preview.command";
import {
  CodeGenCliRuntimeOutput,
} from "./codegen-cli-runtime.contracts";

export class CodeGenCliRuntime {
  constructor(
    readonly registry =
      new CodeGenCliCommandRegistry(),
    readonly parser =
      new CodeGenCliArgumentParser(),
    readonly formatter =
      new CodeGenCliOutputFormatter(),
  ) {
    this.registerDefaults();
  }

  async run(
    argv:
      readonly string[],
    cwd =
      process.cwd(),
  ): Promise<
    CodeGenCliRuntimeOutput
  > {
    const parsed =
      this.parser.parse(argv);

    try {
      const command =
        this.registry.get(
          parsed.command,
        );

      const result =
        await command.execute({
          args:
            parsed.args,
          options:
            parsed.options,
          cwd,
        });

      return {
        success:
          result.success,
        command:
          result.command,
        message:
          result.message,
        ...(result.data !==
        undefined
          ? {
              data:
                result.data,
            }
          : {}),
        errors: [],
        warnings: [],
        executedAt:
          new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        command:
          parsed.command,
        message:
          "Command execution failed",
        errors: [
          error instanceof Error
            ? error.message
            : String(error),
        ],
        warnings: [],
        executedAt:
          new Date().toISOString(),
      };
    }
  }

  private registerDefaults():
    void {
    const commands = [
      new CodeGenHelpCommand(),
      new CodeGenDoctorCommand(),
      new CodeGenListCommand(),
      new CodeGenInspectCommand(),
      new CodeGenPreviewCommand(),
      new CodeGenGenerateCommand(),
    ];

    for (const command of commands) {
      if (
        !this.registry.has(
          command.key,
        )
      ) {
        this.registry.register(
          command,
        );
      }
    }
  }
}

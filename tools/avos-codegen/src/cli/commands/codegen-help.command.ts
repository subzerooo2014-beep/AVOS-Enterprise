import {
  CodeGenCliCommand,
  CodeGenCliCommandContext,
  CodeGenCliCommandResult,
} from "../codegen-cli.contracts";

export class CodeGenHelpCommand
  implements CodeGenCliCommand {
  readonly key = "help";
  readonly name =
    "CodeGen Help";
  readonly description =
    "Displays available AVOS CodeGen commands";
  readonly aliases = [
    "--help",
    "-h",
  ];

  execute(
    _context:
      CodeGenCliCommandContext,
  ): CodeGenCliCommandResult {
    return {
      success: true,
      command:
        this.key,
      message:
        "AVOS CodeGen OS commands",
      data: {
        commands: [
          "help",
          "doctor",
          "list",
          "inspect <key>",
          "preview <key> --mode blueprint|generator|template",
          "generate <key> --mode blueprint|generator|template",
        ],
      },
    };
  }
}

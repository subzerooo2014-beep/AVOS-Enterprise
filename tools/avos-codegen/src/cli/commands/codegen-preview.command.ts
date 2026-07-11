import {
  CodeGenCliCommand,
  CodeGenCliCommandContext,
  CodeGenCliCommandResult,
} from "../codegen-cli.contracts";
import {
  CodeGenGenerationCommandBase,
} from "./codegen-generation-command.base";

export class CodeGenPreviewCommand
  extends CodeGenGenerationCommandBase
  implements CodeGenCliCommand {
  readonly key = "preview";
  readonly name =
    "Preview Generation";
  readonly description =
    "Runs generation without writing files";
  readonly aliases = [
    "plan",
    "dry-run",
  ];

  execute(
    context:
      CodeGenCliCommandContext,
  ): Promise<
    CodeGenCliCommandResult
  > {
    return this.runGeneration(
      context,
      true,
    );
  }
}

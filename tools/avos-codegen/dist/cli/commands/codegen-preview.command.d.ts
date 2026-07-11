import { CodeGenCliCommand, CodeGenCliCommandContext, CodeGenCliCommandResult } from "../codegen-cli.contracts";
import { CodeGenGenerationCommandBase } from "./codegen-generation-command.base";
export declare class CodeGenPreviewCommand extends CodeGenGenerationCommandBase implements CodeGenCliCommand {
    readonly key = "preview";
    readonly name = "Preview Generation";
    readonly description = "Runs generation without writing files";
    readonly aliases: string[];
    execute(context: CodeGenCliCommandContext): Promise<CodeGenCliCommandResult>;
}
//# sourceMappingURL=codegen-preview.command.d.ts.map
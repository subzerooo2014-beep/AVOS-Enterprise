import { CodeGenCliCommand, CodeGenCliCommandContext, CodeGenCliCommandResult } from "../codegen-cli.contracts";
import { CodeGenGenerationCommandBase } from "./codegen-generation-command.base";
export declare class CodeGenGenerateCommand extends CodeGenGenerationCommandBase implements CodeGenCliCommand {
    readonly key = "generate";
    readonly name = "Generate Code";
    readonly description = "Generates code from blueprint, generator, or template";
    readonly aliases: string[];
    execute(context: CodeGenCliCommandContext): Promise<CodeGenCliCommandResult>;
}
//# sourceMappingURL=codegen-generate.command.d.ts.map
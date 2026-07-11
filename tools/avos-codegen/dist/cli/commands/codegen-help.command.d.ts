import { CodeGenCliCommand, CodeGenCliCommandContext, CodeGenCliCommandResult } from "../codegen-cli.contracts";
export declare class CodeGenHelpCommand implements CodeGenCliCommand {
    readonly key = "help";
    readonly name = "CodeGen Help";
    readonly description = "Displays available AVOS CodeGen commands";
    readonly aliases: string[];
    execute(_context: CodeGenCliCommandContext): CodeGenCliCommandResult;
}
//# sourceMappingURL=codegen-help.command.d.ts.map
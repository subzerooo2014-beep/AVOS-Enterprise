import { CodeGenJsonValue } from "../core/codegen.contracts";
export interface CodeGenCliCommandContext {
    args: string[];
    options: Record<string, CodeGenJsonValue>;
    cwd: string;
}
export interface CodeGenCliCommandResult {
    success: boolean;
    command: string;
    message: string;
    data?: CodeGenJsonValue;
}
export interface CodeGenCliCommand {
    readonly key: string;
    readonly name: string;
    readonly description: string;
    readonly aliases: string[];
    execute(context: CodeGenCliCommandContext): Promise<CodeGenCliCommandResult> | CodeGenCliCommandResult;
}
//# sourceMappingURL=codegen-cli.contracts.d.ts.map
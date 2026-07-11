import { CodeGenCliCommand, CodeGenCliCommandContext, CodeGenCliCommandResult } from "../codegen-cli.contracts";
export declare class CodeGenDoctorCommand implements CodeGenCliCommand {
    readonly key = "doctor";
    readonly name = "CodeGen Doctor";
    readonly description = "Checks AVOS CodeGen runtime health";
    readonly aliases: string[];
    execute(context: CodeGenCliCommandContext): CodeGenCliCommandResult;
}
//# sourceMappingURL=codegen-doctor.command.d.ts.map
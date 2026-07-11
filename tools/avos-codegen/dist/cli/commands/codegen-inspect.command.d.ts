import { CodeGenBlueprintBootstrapService } from "../../blueprints/bootstrap/codegen-blueprint-bootstrap.service";
import { CodeGenCliCommand, CodeGenCliCommandContext, CodeGenCliCommandResult } from "../codegen-cli.contracts";
export declare class CodeGenInspectCommand implements CodeGenCliCommand {
    readonly bootstrap: CodeGenBlueprintBootstrapService;
    readonly key = "inspect";
    readonly name = "Inspect CodeGen Asset";
    readonly description = "Inspects a blueprint or template";
    readonly aliases: string[];
    constructor(bootstrap?: CodeGenBlueprintBootstrapService);
    execute(context: CodeGenCliCommandContext): Promise<CodeGenCliCommandResult>;
}
//# sourceMappingURL=codegen-inspect.command.d.ts.map
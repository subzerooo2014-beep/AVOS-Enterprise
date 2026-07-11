import { CodeGenBlueprintBootstrapService } from "../../blueprints/bootstrap/codegen-blueprint-bootstrap.service";
import { CodeGenCliCommand, CodeGenCliCommandContext, CodeGenCliCommandResult } from "../codegen-cli.contracts";
export declare class CodeGenListCommand implements CodeGenCliCommand {
    readonly bootstrap: CodeGenBlueprintBootstrapService;
    readonly key = "list";
    readonly name = "List CodeGen Assets";
    readonly description = "Lists discovered blueprints and templates";
    readonly aliases: string[];
    constructor(bootstrap?: CodeGenBlueprintBootstrapService);
    execute(context: CodeGenCliCommandContext): Promise<CodeGenCliCommandResult>;
}
//# sourceMappingURL=codegen-list.command.d.ts.map
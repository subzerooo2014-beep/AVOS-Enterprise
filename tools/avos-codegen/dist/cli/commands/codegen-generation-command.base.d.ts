import { CodeGenUnifiedGenerationService } from "../../generation/codegen-unified-generation.service";
import { CodeGenCliCommandContext, CodeGenCliCommandResult } from "../codegen-cli.contracts";
export declare abstract class CodeGenGenerationCommandBase {
    readonly generation: CodeGenUnifiedGenerationService;
    constructor(generation?: CodeGenUnifiedGenerationService);
    protected runGeneration(context: CodeGenCliCommandContext, dryRun: boolean): Promise<CodeGenCliCommandResult>;
}
//# sourceMappingURL=codegen-generation-command.base.d.ts.map
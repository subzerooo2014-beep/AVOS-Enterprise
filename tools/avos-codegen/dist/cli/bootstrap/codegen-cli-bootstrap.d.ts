import { CodeGenBlueprintBootstrapService } from "../../blueprints/bootstrap/codegen-blueprint-bootstrap.service";
import { CodeGenUnifiedGenerationService } from "../../generation/codegen-unified-generation.service";
export interface CodeGenCliBootstrapRuntime {
    codegenRoot: string;
    bootstrap: CodeGenBlueprintBootstrapService;
    generation: CodeGenUnifiedGenerationService;
}
export declare function createCodeGenCliBootstrap(codegenRoot?: string): CodeGenCliBootstrapRuntime;
//# sourceMappingURL=codegen-cli-bootstrap.d.ts.map
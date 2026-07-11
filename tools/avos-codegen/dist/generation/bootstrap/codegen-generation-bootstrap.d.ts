import { CodeGenBlueprintExecutionOrchestrator } from "../../blueprints/runtime/codegen-blueprint-execution-orchestrator";
import { CodeGenBlueprintRuntimeExecutor } from "../../blueprints/runtime/codegen-blueprint-runtime-executor";
import { CodeGenBlueprintRuntimeRegistry } from "../../blueprints/runtime/codegen-blueprint-runtime-registry";
import { CodeGenTemplateEngine } from "../../templates/codegen-template-engine";
import { CodeGenBlueprintBootstrapService } from "../../blueprints/bootstrap/codegen-blueprint-bootstrap.service";
export interface CodeGenGenerationBootstrapRuntime {
    bootstrap: CodeGenBlueprintBootstrapService;
    blueprintRegistry: CodeGenBlueprintRuntimeRegistry;
    templateEngine: CodeGenTemplateEngine;
    executor: CodeGenBlueprintRuntimeExecutor;
    orchestrator: CodeGenBlueprintExecutionOrchestrator;
}
export declare function createCodeGenGenerationRuntime(): CodeGenGenerationBootstrapRuntime;
//# sourceMappingURL=codegen-generation-bootstrap.d.ts.map
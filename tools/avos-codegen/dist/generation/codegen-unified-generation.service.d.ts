import { CodeGenBlueprintExecutionOrchestrator } from "../blueprints/runtime/codegen-blueprint-execution-orchestrator";
import { CodeGenGeneratorAdapter } from "../adapters/generators/codegen-generator-adapter";
import { CodeGenGeneratorRegistry } from "../generators/codegen-generator-registry";
import { CodeGenOutputCoordinator } from "../output/codegen-output-coordinator";
import { CodeGenTemplateArtifactPipeline } from "./pipelines/codegen-template-artifact-pipeline";
import { CodeGenUnifiedGenerationRequest } from "./requests/codegen-unified-generation.contracts";
import { CodeGenUnifiedGenerationResultBuilder } from "./results/codegen-unified-generation-result-builder";
export declare class CodeGenUnifiedGenerationService {
    readonly blueprint: CodeGenBlueprintExecutionOrchestrator;
    readonly generatorRegistry: CodeGenGeneratorRegistry;
    readonly generatorAdapter: CodeGenGeneratorAdapter;
    readonly templatePipeline: CodeGenTemplateArtifactPipeline;
    readonly output: CodeGenOutputCoordinator;
    readonly results: CodeGenUnifiedGenerationResultBuilder;
    constructor(blueprint?: CodeGenBlueprintExecutionOrchestrator, generatorRegistry?: CodeGenGeneratorRegistry, generatorAdapter?: CodeGenGeneratorAdapter, templatePipeline?: CodeGenTemplateArtifactPipeline, output?: CodeGenOutputCoordinator, results?: CodeGenUnifiedGenerationResultBuilder);
    execute(request: CodeGenUnifiedGenerationRequest): Promise<import("./requests/codegen-unified-generation.contracts").CodeGenUnifiedGenerationResult>;
}
//# sourceMappingURL=codegen-unified-generation.service.d.ts.map
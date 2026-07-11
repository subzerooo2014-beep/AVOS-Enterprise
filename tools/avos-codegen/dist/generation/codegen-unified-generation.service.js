"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenUnifiedGenerationService = void 0;
const codegen_blueprint_execution_orchestrator_1 = require("../blueprints/runtime/codegen-blueprint-execution-orchestrator");
const codegen_generator_adapter_1 = require("../adapters/generators/codegen-generator-adapter");
const codegen_generator_registry_1 = require("../generators/codegen-generator-registry");
const enterprise_module_v2_generator_1 = require("../generators/enterprise-v2/enterprise-module-v2.generator");
const codegen_output_coordinator_1 = require("../output/codegen-output-coordinator");
const codegen_template_artifact_pipeline_1 = require("./pipelines/codegen-template-artifact-pipeline");
const codegen_unified_generation_contracts_1 = require("./requests/codegen-unified-generation.contracts");
const codegen_unified_generation_result_builder_1 = require("./results/codegen-unified-generation-result-builder");
class CodeGenUnifiedGenerationService {
    blueprint;
    generatorRegistry;
    generatorAdapter;
    templatePipeline;
    output;
    results;
    constructor(blueprint = new codegen_blueprint_execution_orchestrator_1.CodeGenBlueprintExecutionOrchestrator(), generatorRegistry = new codegen_generator_registry_1.CodeGenGeneratorRegistry(), generatorAdapter = new codegen_generator_adapter_1.CodeGenGeneratorAdapter(), templatePipeline = new codegen_template_artifact_pipeline_1.CodeGenTemplateArtifactPipeline(), output = new codegen_output_coordinator_1.CodeGenOutputCoordinator(), results = new codegen_unified_generation_result_builder_1.CodeGenUnifiedGenerationResultBuilder()) {
        this.blueprint = blueprint;
        this.generatorRegistry = generatorRegistry;
        this.generatorAdapter = generatorAdapter;
        this.templatePipeline = templatePipeline;
        this.output = output;
        this.results = results;
        const hasEnterpriseV2 = this.generatorRegistry
            .list()
            .some((generator) => generator.descriptor.key ===
            "enterprise-module-v2");
        if (!hasEnterpriseV2) {
            this.generatorRegistry.register(new enterprise_module_v2_generator_1.EnterpriseModuleV2Generator());
        }
        this.generatorAdapter.engine
            .registry.clear();
        for (const generator of this.generatorRegistry.list()) {
            this.generatorAdapter.engine
                .registry.register(generator);
        }
    }
    async execute(request) {
        const startedAt = new Date().toISOString();
        if (request.mode ===
            codegen_unified_generation_contracts_1.CodeGenUnifiedGenerationMode.BLUEPRINT) {
            const result = await this.blueprint.execute({
                blueprintKey: request.key,
                workspaceRoot: request.workspaceRoot,
                targetRoot: request.targetRoot,
                variables: request.variables,
                dryRun: request.dryRun,
                strict: request.strict,
                conflictPolicy: request.conflictPolicy,
                ...(request.metadata
                    ? {
                        metadata: request.metadata,
                    }
                    : {}),
            });
            return this.results.build({
                success: result.success,
                mode: request.mode,
                key: request.key,
                artifacts: result.runtime.artifacts,
                ...(result.output
                    ? {
                        manifest: result.output.manifest,
                        report: result.output.report,
                    }
                    : {}),
                warnings: result.runtime.warnings,
                errors: result.runtime.errors,
                startedAt,
            });
        }
        if (request.mode ===
            codegen_unified_generation_contracts_1.CodeGenUnifiedGenerationMode.GENERATOR) {
            const adapted = await this.generatorAdapter.execute({
                generatorKey: request.key,
                context: {
                    workspaceRoot: request.workspaceRoot,
                    targetRoot: request.targetRoot,
                    variables: request.variables,
                    dryRun: true,
                    metadata: request.metadata ?? {},
                },
            });
            const output = await this.output.execute({
                sessionId: `generator:${request.key}:${Date.now()}`,
                workspaceRoot: request.workspaceRoot,
                targetRoot: request.targetRoot,
                artifacts: adapted.artifacts,
                dryRun: request.dryRun,
                conflictPolicy: request.conflictPolicy,
            });
            return this.results.build({
                success: output.report.success,
                mode: request.mode,
                key: request.key,
                artifacts: adapted.artifacts,
                manifest: output.manifest,
                report: output.report,
                warnings: adapted.warnings,
                errors: output.report.errors,
                startedAt,
            });
        }
        const artifacts = this.templatePipeline.execute({
            templateKeys: [
                request.key,
            ],
            variables: request.variables,
            strict: request.strict,
            ...(request.metadata
                ? {
                    metadata: request.metadata,
                }
                : {}),
        });
        const output = await this.output.execute({
            sessionId: `template:${request.key}:${Date.now()}`,
            workspaceRoot: request.workspaceRoot,
            targetRoot: request.targetRoot,
            artifacts,
            dryRun: request.dryRun,
            conflictPolicy: request.conflictPolicy,
        });
        return this.results.build({
            success: output.report.success,
            mode: request.mode,
            key: request.key,
            artifacts,
            manifest: output.manifest,
            report: output.report,
            warnings: output.report.warnings,
            errors: output.report.errors,
            startedAt,
        });
    }
}
exports.CodeGenUnifiedGenerationService = CodeGenUnifiedGenerationService;
//# sourceMappingURL=codegen-unified-generation.service.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenBlueprintExecutionOrchestrator = void 0;
const codegen_generation_coordinator_1 = require("../../generation/codegen-generation-coordinator");
const codegen_output_contracts_1 = require("../../output/codegen-output.contracts");
const codegen_output_coordinator_1 = require("../../output/codegen-output-coordinator");
const codegen_blueprint_runtime_executor_1 = require("./codegen-blueprint-runtime-executor");
const codegen_blueprint_runtime_result_builder_1 = require("./codegen-blueprint-runtime-result-builder");
const codegen_blueprint_runtime_contracts_1 = require("./codegen-blueprint-runtime.contracts");
class CodeGenBlueprintExecutionOrchestrator {
    runtime;
    generations;
    output;
    results;
    constructor(runtime = new codegen_blueprint_runtime_executor_1.CodeGenBlueprintRuntimeExecutor(), generations = new codegen_generation_coordinator_1.CodeGenGenerationCoordinator(), output = new codegen_output_coordinator_1.CodeGenOutputCoordinator(), results = new codegen_blueprint_runtime_result_builder_1.CodeGenBlueprintRuntimeResultBuilder()) {
        this.runtime = runtime;
        this.generations = generations;
        this.output = output;
        this.results = results;
    }
    async execute(request) {
        const runtimeExecution = await this.runtime.execute(request);
        if (runtimeExecution.status !==
            codegen_blueprint_runtime_contracts_1.CodeGenBlueprintRuntimeStatus.COMPLETED) {
            return {
                success: false,
                runtime: this.results.build(runtimeExecution),
                generation: undefined,
                output: undefined,
            };
        }
        const generation = await this.generations.execute({
            workspaceRoot: request.workspaceRoot,
            targetRoot: request.targetRoot,
            dryRun: request.dryRun,
            variables: request.variables,
            ...(request.metadata
                ? {
                    metadata: request.metadata,
                }
                : {}),
            artifacts: runtimeExecution.artifacts,
        });
        const output = await this.output.execute({
            sessionId: generation.session.id,
            workspaceRoot: request.workspaceRoot,
            targetRoot: request.targetRoot,
            artifacts: runtimeExecution.artifacts,
            dryRun: request.dryRun,
            conflictPolicy: request.conflictPolicy ??
                codegen_output_contracts_1.CodeGenConflictPolicy.ERROR,
        });
        return {
            success: output.report.success,
            runtime: this.results.build(runtimeExecution),
            generation,
            output,
        };
    }
}
exports.CodeGenBlueprintExecutionOrchestrator = CodeGenBlueprintExecutionOrchestrator;
//# sourceMappingURL=codegen-blueprint-execution-orchestrator.js.map
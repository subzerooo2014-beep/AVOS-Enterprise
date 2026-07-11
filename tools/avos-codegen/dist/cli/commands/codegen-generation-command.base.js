"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenGenerationCommandBase = void 0;
const node_path_1 = require("node:path");
const codegen_output_contracts_1 = require("../../output/codegen-output.contracts");
const codegen_unified_generation_contracts_1 = require("../../generation/requests/codegen-unified-generation.contracts");
const codegen_unified_generation_service_1 = require("../../generation/codegen-unified-generation.service");
const codegen_errors_1 = require("../../core/codegen.errors");
const codegen_cli_json_utilities_1 = require("../runtime/codegen-cli-json.utilities");
class CodeGenGenerationCommandBase {
    generation;
    constructor(generation = new codegen_unified_generation_service_1.CodeGenUnifiedGenerationService()) {
        this.generation = generation;
    }
    async runGeneration(context, dryRun) {
        const key = context.args[0];
        if (!key) {
            throw new codegen_errors_1.CodeGenValidationError("Generation key is required");
        }
        const rawMode = context.options["mode"];
        const mode = typeof rawMode === "string"
            ? rawMode
            : "blueprint";
        if (!Object.values(codegen_unified_generation_contracts_1.CodeGenUnifiedGenerationMode).includes(mode)) {
            throw new codegen_errors_1.CodeGenValidationError(`Unsupported generation mode: ${mode}`);
        }
        const rawVariables = context.options["variables"];
        const variables = rawVariables &&
            typeof rawVariables === "object" &&
            !Array.isArray(rawVariables)
            ? rawVariables
            : {
                moduleName: context.options["moduleName"] ??
                    "Generated Module",
            };
        const rawTarget = context.options["target"];
        const targetRoot = typeof rawTarget === "string"
            ? (0, node_path_1.resolve)(context.cwd, rawTarget)
            : (0, node_path_1.resolve)(context.cwd, "generated");
        const rawPolicy = context.options["policy"];
        const policy = typeof rawPolicy === "string" &&
            Object.values(codegen_output_contracts_1.CodeGenConflictPolicy).includes(rawPolicy)
            ? rawPolicy
            : codegen_output_contracts_1.CodeGenConflictPolicy.ERROR;
        const result = await this.generation.execute({
            mode: mode,
            key,
            workspaceRoot: context.cwd,
            targetRoot,
            variables,
            dryRun,
            strict: context.options["strict"] !== false,
            conflictPolicy: policy,
            metadata: {
                source: "cli",
            },
        });
        return {
            success: result.success,
            command: dryRun
                ? "preview"
                : "generate",
            message: dryRun
                ? "Generation preview completed"
                : "Generation completed",
            data: (0, codegen_cli_json_utilities_1.toCodeGenJsonValue)(result),
        };
    }
}
exports.CodeGenGenerationCommandBase = CodeGenGenerationCommandBase;
//# sourceMappingURL=codegen-generation-command.base.js.map
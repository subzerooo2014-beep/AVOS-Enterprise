"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenEndToEndSmokeRunner = void 0;
const promises_1 = require("node:fs/promises");
const node_os_1 = require("node:os");
const node_path_1 = require("node:path");
const codegen_output_contracts_1 = require("../../output/codegen-output.contracts");
const codegen_generation_bootstrap_1 = require("../../generation/bootstrap/codegen-generation-bootstrap");
class CodeGenEndToEndSmokeRunner {
    async run(codegenRoot) {
        const startedAt = new Date().toISOString();
        const checks = [];
        const runtime = (0, codegen_generation_bootstrap_1.createCodeGenGenerationRuntime)();
        const targetRoot = await (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), "avos-codegen-smoke-"));
        try {
            const bootstrap = await runtime.bootstrap.initialize({
                codegenRoot: (0, node_path_1.resolve)(codegenRoot),
                replace: true,
            });
            checks.push({
                key: "bootstrap",
                success: bootstrap.blueprints.length > 0 &&
                    bootstrap.templates.length > 0,
                details: `Blueprints=${bootstrap.blueprints.length}; Templates=${bootstrap.templates.length}`,
            });
            const result = await runtime.orchestrator.execute({
                blueprintKey: "enterprise-module-v2",
                workspaceRoot: (0, node_path_1.resolve)(codegenRoot),
                targetRoot,
                variables: {
                    moduleName: "Smoke Inventory",
                },
                dryRun: true,
                strict: true,
                conflictPolicy: codegen_output_contracts_1.CodeGenConflictPolicy.ERROR,
                metadata: {
                    source: "end-to-end-smoke",
                },
            });
            checks.push({
                key: "blueprint-execution",
                success: result.success,
                details: `Artifacts=${result.runtime.artifacts.length}; Errors=${result.runtime.errors.length}`,
            });
            checks.push({
                key: "artifact-generation",
                success: result.runtime.artifacts.length >= 2,
                details: result.runtime.artifacts
                    .map((artifact) => artifact.relativePath)
                    .join(", "),
            });
            const completedAt = new Date().toISOString();
            return {
                success: checks.every((check) => check.success),
                checks,
                generatedFiles: result.runtime.artifacts.length,
                blueprintKey: "enterprise-module-v2",
                targetRoot,
                startedAt,
                completedAt,
            };
        }
        finally {
            await (0, promises_1.rm)(targetRoot, {
                recursive: true,
                force: true,
            });
        }
    }
}
exports.CodeGenEndToEndSmokeRunner = CodeGenEndToEndSmokeRunner;
//# sourceMappingURL=codegen-end-to-end-smoke-runner.js.map
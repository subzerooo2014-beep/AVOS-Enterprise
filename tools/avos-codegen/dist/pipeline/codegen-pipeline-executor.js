"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenPipelineExecutor = void 0;
const node_crypto_1 = require("node:crypto");
class CodeGenPipelineExecutor {
    async execute(steps, context) {
        const executionId = (0, node_crypto_1.randomUUID)();
        const startedAt = new Date().toISOString();
        const ordered = [...steps]
            .filter((step) => step.enabled)
            .sort((a, b) => a.order - b.order);
        const results = [];
        for (const step of ordered) {
            const result = await step.execute({
                ...context,
                executionId,
            });
            results.push(result);
            if (result.status === "failed") {
                break;
            }
        }
        const completedAt = new Date().toISOString();
        return {
            executionId,
            success: results.every((result) => result.status === "succeeded" ||
                result.status === "skipped"),
            steps: results,
            startedAt,
            completedAt,
        };
    }
}
exports.CodeGenPipelineExecutor = CodeGenPipelineExecutor;
//# sourceMappingURL=codegen-pipeline-executor.js.map
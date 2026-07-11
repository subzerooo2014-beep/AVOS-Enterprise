"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenRollbackEngine = void 0;
const codegen_rollback_contracts_1 = require("./codegen-rollback.contracts");
class CodeGenRollbackEngine {
    handlers = new Map();
    register(handler, replace = false) {
        if (this.handlers.has(handler.key) &&
            !replace) {
            throw new Error(`Rollback handler already exists: ${handler.key}`);
        }
        this.handlers.set(handler.key, handler);
        return handler;
    }
    async execute(steps) {
        const startedAt = new Date().toISOString();
        const ordered = [...steps]
            .sort((left, right) => right.priority -
            left.priority);
        const results = [];
        for (const step of ordered) {
            const stepStartedAt = new Date().toISOString();
            const handler = this.handlers.get(step.key);
            if (!handler) {
                step.status =
                    codegen_rollback_contracts_1.CodeGenRollbackStepStatus.SKIPPED;
                const completedAt = new Date().toISOString();
                results.push({
                    stepId: step.id,
                    stepKey: step.key,
                    success: false,
                    error: `Rollback handler was not found: ${step.key}`,
                    startedAt: stepStartedAt,
                    completedAt,
                    durationMs: Date.parse(completedAt) -
                        Date.parse(stepStartedAt),
                });
                continue;
            }
            try {
                step.status =
                    codegen_rollback_contracts_1.CodeGenRollbackStepStatus.RUNNING;
                await handler.execute(step);
                step.status =
                    codegen_rollback_contracts_1.CodeGenRollbackStepStatus.SUCCEEDED;
                const completedAt = new Date().toISOString();
                results.push({
                    stepId: step.id,
                    stepKey: step.key,
                    success: true,
                    startedAt: stepStartedAt,
                    completedAt,
                    durationMs: Date.parse(completedAt) -
                        Date.parse(stepStartedAt),
                });
            }
            catch (error) {
                step.status =
                    codegen_rollback_contracts_1.CodeGenRollbackStepStatus.FAILED;
                const completedAt = new Date().toISOString();
                results.push({
                    stepId: step.id,
                    stepKey: step.key,
                    success: false,
                    error: error instanceof Error
                        ? error.message
                        : String(error),
                    startedAt: stepStartedAt,
                    completedAt,
                    durationMs: Date.parse(completedAt) -
                        Date.parse(stepStartedAt),
                });
            }
        }
        const completedAt = new Date().toISOString();
        const failedSteps = results.filter((result) => !result.success).length;
        return {
            success: failedSteps === 0,
            results,
            failedSteps,
            completedSteps: results.length -
                failedSteps,
            startedAt,
            completedAt,
            durationMs: Date.parse(completedAt) -
                Date.parse(startedAt),
        };
    }
}
exports.CodeGenRollbackEngine = CodeGenRollbackEngine;
//# sourceMappingURL=codegen-rollback-engine.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenBlueprintExecutionContextFactory = void 0;
class CodeGenBlueprintExecutionContextFactory {
    create(execution, blueprint) {
        return {
            executionId: execution.executionId,
            blueprint: structuredClone(blueprint),
            request: structuredClone(execution.request),
            workspaceRoot: execution.request
                .workspaceRoot,
            targetRoot: execution.request
                .targetRoot,
            variables: structuredClone(execution.request
                .variables),
            metadata: structuredClone(execution.request
                .metadata ?? {}),
            dryRun: execution.request
                .dryRun,
            strict: execution.request
                .strict,
            startedAt: new Date().toISOString(),
        };
    }
}
exports.CodeGenBlueprintExecutionContextFactory = CodeGenBlueprintExecutionContextFactory;
//# sourceMappingURL=codegen-blueprint-execution-context.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenDefaultExecutionTaskHandler = void 0;
class CodeGenDefaultExecutionTaskHandler {
    type;
    constructor(type) {
        this.type = type;
    }
    async execute(context) {
        const startedAt = new Date().toISOString();
        const output = context.task.artifact
            ? {
                artifactKey: context.task.artifact.key,
                relativePath: context.task.artifact.relativePath,
                contentLength: context.task.artifact.content.length,
            }
            : {
                taskKey: context.task.key,
            };
        const completedAt = new Date().toISOString();
        return {
            taskId: context.task.id,
            taskKey: context.task.key,
            workerId: context.workerId,
            success: true,
            skipped: false,
            output,
            startedAt,
            completedAt,
            durationMs: Date.parse(completedAt) -
                Date.parse(startedAt),
            metadata: {
                handlerType: this.type,
            },
        };
    }
}
exports.CodeGenDefaultExecutionTaskHandler = CodeGenDefaultExecutionTaskHandler;
//# sourceMappingURL=codegen-default-execution-task-handler.js.map
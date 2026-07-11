"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenExecutionTaskFactory = void 0;
const node_crypto_1 = require("node:crypto");
const codegen_execution_task_contracts_1 = require("../contracts/codegen-execution-task.contracts");
class CodeGenExecutionTaskFactory {
    fromArtifact(artifact, input = {}) {
        const now = new Date().toISOString();
        return {
            id: (0, node_crypto_1.randomUUID)(),
            key: artifact.key,
            type: input.type ??
                codegen_execution_task_contracts_1.CodeGenExecutionTaskType.GENERATE,
            artifact: structuredClone(artifact),
            dependencies: [...artifact.dependencies],
            priority: input.priority ??
                100,
            weight: input.weight ??
                Math.max(1, Math.ceil(artifact.content.length /
                    1000)),
            status: codegen_execution_task_contracts_1.CodeGenExecutionTaskStatus.CREATED,
            attempts: 0,
            maximumAttempts: input.maximumAttempts ??
                1,
            metadata: {
                relativePath: artifact.relativePath,
                artifactType: artifact.type,
            },
            createdAt: now,
            updatedAt: now,
        };
    }
    fromArtifacts(artifacts) {
        return artifacts.map((artifact) => this.fromArtifact(artifact));
    }
}
exports.CodeGenExecutionTaskFactory = CodeGenExecutionTaskFactory;
//# sourceMappingURL=codegen-execution-task-factory.js.map
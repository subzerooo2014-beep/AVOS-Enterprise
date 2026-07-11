"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenExecutionPlanBuilder = void 0;
const node_crypto_1 = require("node:crypto");
const codegen_planning_contracts_1 = require("../contracts/codegen-planning.contracts");
class CodeGenExecutionPlanBuilder {
    build(context) {
        const nodes = this.createNodes(context);
        const stages = this.createStages(nodes);
        const orderedArtifactKeys = stages.flatMap((stage) => stage.artifactKeys);
        return {
            id: (0, node_crypto_1.randomUUID)(),
            executionId: context.executionId,
            status: codegen_planning_contracts_1.CodeGenPlanningStatus.COMPLETED,
            nodes,
            stages,
            orderedArtifactKeys,
            warnings: [],
            errors: [],
            metadata: structuredClone(context.metadata),
            createdAt: new Date().toISOString(),
            completedAt: new Date().toISOString(),
        };
    }
    createNodes(context) {
        const byKey = new Map(context.artifacts.map((artifact) => [
            artifact.key,
            artifact,
        ]));
        return context.artifacts.map((artifact) => {
            const blockedBy = artifact.dependencies
                .filter((dependencyKey) => !byKey.has(dependencyKey));
            const dependents = context.artifacts
                .filter((candidate) => candidate.dependencies.includes(artifact.key))
                .map((candidate) => candidate.key);
            return {
                key: artifact.key,
                artifact: structuredClone(artifact),
                dependencies: [...artifact.dependencies],
                dependents,
                depth: 0,
                stage: 0,
                ready: blockedBy.length ===
                    0,
                blockedBy,
            };
        });
    }
    createStages(nodes) {
        const remaining = new Map(nodes.map((node) => [
            node.key,
            structuredClone(node),
        ]));
        const completed = new Set();
        const stages = [];
        let stageIndex = 0;
        while (remaining.size > 0) {
            const ready = Array.from(remaining.values())
                .filter((node) => node.dependencies.every((dependencyKey) => completed.has(dependencyKey) ||
                !remaining.has(dependencyKey)))
                .sort((left, right) => left.key.localeCompare(right.key));
            if (ready.length === 0) {
                break;
            }
            const artifactKeys = ready.map((node) => node.key);
            stages.push({
                index: stageIndex,
                type: ready.length > 1
                    ? codegen_planning_contracts_1.CodeGenExecutionStageType.PARALLEL
                    : codegen_planning_contracts_1.CodeGenExecutionStageType.SERIAL,
                artifactKeys,
                dependsOnStages: stageIndex === 0
                    ? []
                    : [
                        stageIndex - 1,
                    ],
                canRunInParallel: ready.length > 1,
            });
            for (const node of ready) {
                const original = nodes.find((candidate) => candidate.key ===
                    node.key);
                if (original) {
                    original.stage =
                        stageIndex;
                    original.depth =
                        stageIndex;
                }
                remaining.delete(node.key);
                completed.add(node.key);
            }
            stageIndex += 1;
        }
        return stages;
    }
}
exports.CodeGenExecutionPlanBuilder = CodeGenExecutionPlanBuilder;
//# sourceMappingURL=codegen-execution-plan-builder.js.map
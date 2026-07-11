"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenExecutionScheduleBuilder = void 0;
const node_crypto_1 = require("node:crypto");
const codegen_artifact_priority_calculator_1 = require("./codegen-artifact-priority-calculator");
const codegen_scheduling_contracts_1 = require("./codegen-scheduling.contracts");
const codegen_retry_policy_engine_1 = require("../retry/codegen-retry-policy-engine");
const codegen_stage_barrier_planner_1 = require("../barriers/codegen-stage-barrier-planner");
class CodeGenExecutionScheduleBuilder {
    priorities;
    retries;
    barriers;
    constructor(priorities = new codegen_artifact_priority_calculator_1.CodeGenArtifactPriorityCalculator(), retries = new codegen_retry_policy_engine_1.CodeGenRetryPolicyEngine(), barriers = new codegen_stage_barrier_planner_1.CodeGenStageBarrierPlanner()) {
        this.priorities = priorities;
        this.retries = retries;
        this.barriers = barriers;
    }
    build(executionPlan, policy) {
        const items = executionPlan.nodes.map((node) => ({
            artifactKey: node.key,
            stageIndex: node.stage,
            priority: this.priorities.calculate(node),
            weight: Math.max(1, Math.ceil(node.artifact.content.length /
                1000)),
            dependencies: [...node.dependencies],
            status: node.ready
                ? codegen_scheduling_contracts_1.CodeGenScheduleItemStatus.READY
                : codegen_scheduling_contracts_1.CodeGenScheduleItemStatus.PENDING,
            attempts: 0,
            retryPolicy: this.retries.create({
                maxAttempts: 3,
                backoffMs: 250,
                backoffMultiplier: 2,
            }),
            metadata: {
                relativePath: node.artifact.relativePath,
                artifactType: node.artifact.type,
            },
        }));
        const stages = this.barriers.plan(executionPlan, policy.maxParallel);
        return {
            id: (0, node_crypto_1.randomUUID)(),
            executionId: executionPlan.executionId,
            policy,
            items,
            stages,
            totalWeight: items.reduce((total, item) => total + item.weight, 0),
            estimatedParallelism: stages.length === 0
                ? 0
                : Math.max(...stages.map((stage) => stage.concurrency)),
            createdAt: new Date().toISOString(),
        };
    }
}
exports.CodeGenExecutionScheduleBuilder = CodeGenExecutionScheduleBuilder;
//# sourceMappingURL=codegen-execution-schedule-builder.js.map
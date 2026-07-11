import {
  randomUUID,
} from "node:crypto";
import {
  CodeGenExecutionPlan,
} from "../contracts/codegen-planning.contracts";
import {
  CodeGenArtifactPriorityCalculator,
} from "./codegen-artifact-priority-calculator";
import {
  CodeGenConcurrencyPolicy,
  CodeGenExecutionSchedule,
  CodeGenScheduleItemStatus,
} from "./codegen-scheduling.contracts";
import {
  CodeGenRetryPolicyEngine,
} from "../retry/codegen-retry-policy-engine";
import {
  CodeGenStageBarrierPlanner,
} from "../barriers/codegen-stage-barrier-planner";

export class CodeGenExecutionScheduleBuilder {
  constructor(
    readonly priorities =
      new CodeGenArtifactPriorityCalculator(),
    readonly retries =
      new CodeGenRetryPolicyEngine(),
    readonly barriers =
      new CodeGenStageBarrierPlanner(),
  ) {}

  build(
    executionPlan:
      CodeGenExecutionPlan,
    policy:
      CodeGenConcurrencyPolicy,
  ): CodeGenExecutionSchedule {
    const items =
      executionPlan.nodes.map(
        (node) => ({
          artifactKey:
            node.key,
          stageIndex:
            node.stage,
          priority:
            this.priorities.calculate(
              node,
            ),
          weight:
            Math.max(
              1,
              Math.ceil(
                node.artifact.content.length /
                1000,
              ),
            ),
          dependencies:
            [...node.dependencies],
          status:
            node.ready
              ? CodeGenScheduleItemStatus.READY
              : CodeGenScheduleItemStatus.PENDING,
          attempts:
            0,
          retryPolicy:
            this.retries.create({
              maxAttempts: 3,
              backoffMs: 250,
              backoffMultiplier: 2,
            }),
          metadata: {
            relativePath:
              node.artifact.relativePath,
            artifactType:
              node.artifact.type,
          },
        }),
      );

    const stages =
      this.barriers.plan(
        executionPlan,
        policy.maxParallel,
      );

    return {
      id:
        randomUUID(),
      executionId:
        executionPlan.executionId,
      policy,
      items,
      stages,
      totalWeight:
        items.reduce(
          (total, item) =>
            total + item.weight,
          0,
        ),
      estimatedParallelism:
        stages.length === 0
          ? 0
          : Math.max(
              ...stages.map(
                (stage) =>
                  stage.concurrency,
              ),
            ),
      createdAt:
        new Date().toISOString(),
    };
  }
}

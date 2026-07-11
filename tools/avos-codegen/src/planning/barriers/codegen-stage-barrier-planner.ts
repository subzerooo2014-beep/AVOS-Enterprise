import {
  CodeGenExecutionPlan,
} from "../contracts/codegen-planning.contracts";
import {
  CodeGenExecutionScheduleStage,
} from "../scheduling/codegen-scheduling.contracts";

export class CodeGenStageBarrierPlanner {
  plan(
    executionPlan:
      CodeGenExecutionPlan,
    maxParallel: number,
  ): CodeGenExecutionScheduleStage[] {
    return executionPlan.stages.map(
      (stage, index) => ({
        index:
          stage.index,
        artifactKeys:
          [...stage.artifactKeys],
        barrierBefore:
          index > 0,
        barrierAfter:
          index <
          executionPlan.stages.length -
            1,
        concurrency:
          Math.max(
            1,
            Math.min(
              maxParallel,
              stage.artifactKeys.length,
            ),
          ),
        estimatedWeight:
          stage.artifactKeys.length,
      }),
    );
  }
}

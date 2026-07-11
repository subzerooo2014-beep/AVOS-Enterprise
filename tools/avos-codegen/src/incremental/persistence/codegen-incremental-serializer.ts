import {
  CodeGenIncrementalExecutionPlan,
  CodeGenIncrementalMetrics,
  CodeGenIncrementalRun,
} from "../contracts/codegen-incremental.contracts";

export class CodeGenIncrementalSerializer {
  serializeRun(
    run:
      CodeGenIncrementalRun,
  ): string {
    return JSON.stringify(
      run,
      null,
      2,
    );
  }

  serializePlan(
    plan:
      CodeGenIncrementalExecutionPlan,
  ): string {
    return JSON.stringify(
      plan,
      null,
      2,
    );
  }

  serializeMetrics(
    metrics:
      CodeGenIncrementalMetrics,
  ): string {
    return JSON.stringify(
      metrics,
      null,
      2,
    );
  }
}

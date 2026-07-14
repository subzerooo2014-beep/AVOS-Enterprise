import { Injectable } from "@nestjs/common";

@Injectable()
export class WorkflowRuntimeOrchestratorRuntime {
  execute(input: Record<string, unknown>) {
    return {
      id: "workflow-runtime-orchestrator_"+Date.now(),
      input,
      status: "COMPLETED",
    };
  }
}

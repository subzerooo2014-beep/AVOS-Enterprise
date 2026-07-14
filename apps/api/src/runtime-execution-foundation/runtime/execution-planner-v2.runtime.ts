import { Injectable } from "@nestjs/common";

@Injectable()
export class ExecutionPlannerV2Runtime {
  execute(input: Record<string, unknown>) {
    return {
      id: "execution-planner-v2_"+Date.now(),
      input,
      status: "COMPLETED",
    };
  }
}

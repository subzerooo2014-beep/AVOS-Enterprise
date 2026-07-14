import { Injectable } from "@nestjs/common";
@Injectable()
export class SchedulerRuntime {
  execute(input: Record<string, unknown>) {
    return { id: "scheduler_runtime_"+Date.now(), input, status: "COMPLETED" };
  }
}

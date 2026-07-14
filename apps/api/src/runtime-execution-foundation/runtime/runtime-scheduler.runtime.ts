import { Injectable } from "@nestjs/common";

@Injectable()
export class RuntimeSchedulerRuntime {
  execute(input: Record<string, unknown>) {
    return {
      id: "runtime-scheduler_"+Date.now(),
      input,
      status: "COMPLETED",
    };
  }
}

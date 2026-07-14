import { Injectable } from "@nestjs/common";

@Injectable()
export class FaultIsolationRuntime {
  execute(input: Record<string, unknown>) {
    return {
      id: "fault-isolation_"+Date.now(),
      input,
      status: "COMPLETED",
    };
  }
}

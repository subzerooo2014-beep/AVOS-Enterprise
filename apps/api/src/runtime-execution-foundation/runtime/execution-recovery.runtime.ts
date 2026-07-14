import { Injectable } from "@nestjs/common";

@Injectable()
export class ExecutionRecoveryRuntime {
  execute(input: Record<string, unknown>) {
    return {
      id: "execution-recovery_"+Date.now(),
      input,
      status: "COMPLETED",
    };
  }
}

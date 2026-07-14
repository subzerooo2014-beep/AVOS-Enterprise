import { Injectable } from "@nestjs/common";
@Injectable()
export class RetryRuntime {
  execute(input: Record<string, unknown>) {
    return { id: "retry_runtime_"+Date.now(), input, status: "COMPLETED" };
  }
}

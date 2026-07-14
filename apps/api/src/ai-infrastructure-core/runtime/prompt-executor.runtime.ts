import { Injectable } from "@nestjs/common";
@Injectable()
export class PromptExecutorRuntime {
  execute(input: Record<string, unknown>) {
    return { id: "prompt-executor_"+Date.now(), input, status: "COMPLETED" };
  }
}

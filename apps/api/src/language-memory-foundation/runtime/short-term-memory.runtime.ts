import { Injectable } from "@nestjs/common";

@Injectable()
export class ShortTermMemoryRuntime {
  execute(input: Record<string, unknown>) {
    return {
      id: "short-term-memory_"+Date.now(),
      input,
      status: "COMPLETED",
    };
  }
}

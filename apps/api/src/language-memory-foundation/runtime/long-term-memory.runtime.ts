import { Injectable } from "@nestjs/common";

@Injectable()
export class LongTermMemoryRuntime {
  execute(input: Record<string, unknown>) {
    return {
      id: "long-term-memory_"+Date.now(),
      input,
      status: "COMPLETED",
    };
  }
}

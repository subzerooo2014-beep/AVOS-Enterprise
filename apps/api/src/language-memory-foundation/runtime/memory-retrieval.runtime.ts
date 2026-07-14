import { Injectable } from "@nestjs/common";

@Injectable()
export class MemoryRetrievalRuntime {
  execute(input: Record<string, unknown>) {
    return {
      id: "memory-retrieval_"+Date.now(),
      input,
      status: "COMPLETED",
    };
  }
}

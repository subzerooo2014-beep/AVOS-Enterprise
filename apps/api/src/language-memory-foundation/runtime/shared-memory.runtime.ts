import { Injectable } from "@nestjs/common";

@Injectable()
export class SharedMemoryRuntime {
  execute(input: Record<string, unknown>) {
    return {
      id: "shared-memory_"+Date.now(),
      input,
      status: "COMPLETED",
    };
  }
}

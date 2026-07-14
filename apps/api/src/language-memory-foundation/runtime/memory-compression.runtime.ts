import { Injectable } from "@nestjs/common";

@Injectable()
export class MemoryCompressionRuntime {
  execute(input: Record<string, unknown>) {
    return {
      id: "memory-compression_"+Date.now(),
      input,
      status: "COMPLETED",
    };
  }
}

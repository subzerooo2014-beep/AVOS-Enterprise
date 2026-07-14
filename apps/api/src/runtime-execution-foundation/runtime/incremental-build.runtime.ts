import { Injectable } from "@nestjs/common";

@Injectable()
export class IncrementalBuildRuntime {
  execute(input: Record<string, unknown>) {
    return {
      id: "incremental-build_"+Date.now(),
      input,
      status: "COMPLETED",
    };
  }
}

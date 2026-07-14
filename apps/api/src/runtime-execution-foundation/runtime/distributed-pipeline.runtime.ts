import { Injectable } from "@nestjs/common";

@Injectable()
export class DistributedPipelineRuntime {
  execute(input: Record<string, unknown>) {
    return {
      id: "distributed-pipeline_"+Date.now(),
      input,
      status: "COMPLETED",
    };
  }
}

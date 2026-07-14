import { Injectable } from "@nestjs/common";

@Injectable()
export class BatchIntelligenceEngine {
  execute(tasks: Array<{ type: string; payload: Record<string, unknown> }>) {
    return tasks.map((task, index) => ({
      index,
      type: task.type,
      status: "QUEUED",
      payload: task.payload,
    }));
  }
}

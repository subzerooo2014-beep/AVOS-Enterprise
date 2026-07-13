import { Injectable } from "@nestjs/common";

@Injectable()
export class DistributedTaskScheduler {
  schedule(task: any) {
    return {
      scheduled: true,
      taskId: `task-${Date.now()}`,
      payload: task,
    };
  }
}

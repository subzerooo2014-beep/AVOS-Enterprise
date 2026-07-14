import { Injectable } from "@nestjs/common";
@Injectable()
export class AiSchedulerService {
  schedule(taskId: string, scheduledAt: string) {
    return { id: `ai_schedule_${Date.now()}`, taskId, scheduledAt, status: "SCHEDULED" };
  }
}

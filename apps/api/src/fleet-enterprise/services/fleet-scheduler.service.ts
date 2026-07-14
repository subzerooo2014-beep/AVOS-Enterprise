import { Injectable } from "@nestjs/common";
@Injectable()
export class FleetSchedulerService {
  schedule(type: string, entityId: string, scheduledAt: string) {
    return { id: `schedule_${Date.now()}`, type, entityId, scheduledAt, status: "SCHEDULED" };
  }
}

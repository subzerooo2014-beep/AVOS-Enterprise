import { Injectable } from "@nestjs/common";
@Injectable()
export class HandoverService {
  schedule(input: {
    journeyId: string;
    location: string;
    scheduledAt: string;
  }) {
    return {
      id: `handover_${Date.now()}`,
      ...input,
      status: "SCHEDULED",
    };
  }
}

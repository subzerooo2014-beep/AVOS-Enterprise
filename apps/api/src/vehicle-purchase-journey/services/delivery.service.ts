import { Injectable } from "@nestjs/common";
@Injectable()
export class JourneyDeliveryService {
  schedule(input: { journeyId: string; address: string; scheduledAt: string }) {
    return { id: `delivery_${Date.now()}`, ...input, status: "SCHEDULED" };
  }
}

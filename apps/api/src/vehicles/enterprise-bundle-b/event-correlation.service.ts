import { Injectable } from "@nestjs/common";

@Injectable()
export class EventCorrelationService {
  create(input: {
    vehicleId: string;
    eventType: string;
  }) {
    return {
      correlationId: `corr-${input.vehicleId}-${Date.now()}`,
      vehicleId: input.vehicleId,
      eventType: input.eventType,
    };
  }
}

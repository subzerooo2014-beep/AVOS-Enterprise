import { Injectable } from "@nestjs/common";

@Injectable()
export class VehicleDeliveryReadinessService {
  evaluate(input: {
    inspectionPassed: boolean;
    paymentCompleted: boolean;
    transferCompleted: boolean;
    logisticsReady: boolean;
  }) {
    const completed = Object.values(input).filter(Boolean).length;

    return {
      completed,
      ready: completed === 4,
      status: completed === 4 ? "READY" : "PENDING",
    };
  }
}

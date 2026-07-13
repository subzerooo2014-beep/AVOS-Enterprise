import { Injectable } from "@nestjs/common";

@Injectable()
export class VehicleTransactionOrchestratorService {
  orchestrate(input: {
    financeReady: boolean;
    insuranceReady: boolean;
    transferReady: boolean;
    deliveryReady: boolean;
  }) {
    const ready = Object.values(input).every(Boolean);

    return {
      ready,
      status: ready ? "EXECUTE" : "PENDING",
      actions: ready
        ? ["capture-payment", "transfer-ownership", "schedule-delivery"]
        : ["resolve-blockers"],
    };
  }
}

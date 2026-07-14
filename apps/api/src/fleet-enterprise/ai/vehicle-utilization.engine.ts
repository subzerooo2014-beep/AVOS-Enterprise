import { Injectable } from "@nestjs/common";
@Injectable()
export class VehicleUtilizationEngine {
  calculate(input: { activeHours: number; availableHours: number; tripCount: number }) {
    const utilization =
      input.availableHours > 0
        ? Math.round((input.activeHours / input.availableHours) * 100)
        : 0;
    return {
      utilization,
      tripCount: input.tripCount,
      recommendation:
        utilization < 30 ? "REALLOCATE_OR_REDUCE_FLEET" :
        utilization > 85 ? "ADD_CAPACITY" :
        "BALANCED",
    };
  }
}

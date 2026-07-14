import { Injectable } from "@nestjs/common";
@Injectable()
export class FleetCostEngine {
  calculate(input: { fuelCost: number; maintenanceCost: number; insuranceCost: number; depreciationCost: number }) {
    const total =
      input.fuelCost +
      input.maintenanceCost +
      input.insuranceCost +
      input.depreciationCost;
    return {
      totalCost: Math.round(total * 100) / 100,
      breakdown: input,
    };
  }
}

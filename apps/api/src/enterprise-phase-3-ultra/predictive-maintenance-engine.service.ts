import { Injectable } from "@nestjs/common";

@Injectable()
export class PredictiveMaintenanceEngineService {
  evaluate(cpu = 54, memory = 61, errorRate = 0.8) {
    const healthScore = Math.max(
      0,
      Math.round(100 - Math.max(cpu - 70, 0) - Math.max(memory - 75, 0) - errorRate * 5),
    );

    return {
      healthScore,
      maintenanceRequired: healthScore < 80,
      action: healthScore < 80 ? "schedule-preventive-maintenance" : "maintain-current-state",
      evaluatedAt: new Date().toISOString(),
    };
  }
}
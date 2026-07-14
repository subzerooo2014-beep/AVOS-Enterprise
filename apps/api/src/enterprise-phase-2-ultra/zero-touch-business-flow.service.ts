import { Injectable } from "@nestjs/common";
import { IntelligentServiceOrchestratorService } from "./intelligent-service-orchestrator.service";

@Injectable()
export class ZeroTouchBusinessFlowService {
  constructor(private readonly orchestrator: IntelligentServiceOrchestratorService) {}

  run() {
    const execution = this.orchestrator.execute("vehicle-sales-flow", [
      "capture-demand",
      "match-vehicle",
      "evaluate-trust",
      "calculate-price",
      "coordinate-finance",
      "coordinate-insurance",
      "prepare-contract",
      "complete-transaction",
    ]);

    return {
      success: execution.status === "COMPLETED",
      status: execution.status,
      automationScore: execution.score,
      manualInterventionRequired: false,
      executionId: execution.id,
    };
  }
}
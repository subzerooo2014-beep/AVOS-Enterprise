import { Injectable } from "@nestjs/common";
import { GenesisGenerationPlan } from "../types/genesis-platform.types";

@Injectable()
export class ExecutionPlannerService {
  buildExecutionOrder(plan: GenesisGenerationPlan): string[] {
    return [...plan.steps]
      .sort((a, b) => a.sequence - b.sequence)
      .map((step) => step.id);
  }

  summarize(plan: GenesisGenerationPlan): Record<string, unknown> {
    return {
      planId: plan.id,
      blueprintId: plan.blueprintId,
      steps: plan.steps.length,
      reversibleSteps: plan.steps.filter((step) => step.reversible).length,
      approvalState: plan.approvalState,
      riskScore: plan.riskScore,
    };
  }
}

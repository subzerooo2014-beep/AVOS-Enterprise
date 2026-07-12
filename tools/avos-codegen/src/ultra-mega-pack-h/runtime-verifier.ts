import { EnterpriseControlOrchestrationResult } from "./orchestrator-v5";

export interface UltraMegaPackHHealth {
  healthy: boolean;
  status: string;
  score: number;
  enterpriseScore: number;
  directives: number;
  forecasts: number;
  interventionForecasts: number;
  resourceAllocations: number;
  fullySatisfiedAllocations: number;
  councilDecision: string;
  councilConsensus: number;
  routedCommands: number;
  approvalRequiredCommands: number;
  findingCount: number;
  evidenceCount: number;
}

export class UltraMegaPackHRuntimeVerifier {
  verify(
    result: EnterpriseControlOrchestrationResult,
  ): UltraMegaPackHHealth {
    return {
      healthy:
        result.success &&
        result.commandCenter.enterpriseScore >= 70 &&
        result.council.decision !== "reject" &&
        result.controlPlane.routedCommands.length > 0,
      status: result.status,
      score: result.score,
      enterpriseScore: result.commandCenter.enterpriseScore,
      directives: result.commandCenter.directives.length,
      forecasts: result.predictive.forecasts.length,
      interventionForecasts: result.predictive.forecasts.filter(
        (forecast) => forecast.interventionRequired,
      ).length,
      resourceAllocations: result.resources.allocations.length,
      fullySatisfiedAllocations: result.resources.allocations.filter(
        (allocation) => allocation.fullySatisfied,
      ).length,
      councilDecision: result.council.decision,
      councilConsensus: result.council.consensusScore,
      routedCommands: result.controlPlane.routedCommands.filter(
        (command) => command.status === "routed",
      ).length,
      approvalRequiredCommands: result.controlPlane.routedCommands.filter(
        (command) => command.status === "approval_required",
      ).length,
      findingCount: result.findings.length,
      evidenceCount: result.evidence.length,
    };
  }
}

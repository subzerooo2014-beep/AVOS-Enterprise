import { Controller, Get, Post } from "@nestjs/common";
import { EnterprisePhase4UltraOrchestratorService } from "./enterprise-phase-4-ultra-orchestrator.service";

@Controller("enterprise-phase-4-ultra")
export class EnterprisePhase4UltraController {
  constructor(
    private readonly orchestrator: EnterprisePhase4UltraOrchestratorService,
  ) {}

  @Get("status")
  status() {
    return this.orchestrator.status();
  }

  @Post("bootstrap")
  bootstrap() {
    return this.orchestrator.bootstrap();
  }

  @Post("smoke")
  smoke() {
    const result = this.orchestrator.run();

    return {
      success: result.success,
      system: "AVOS Enterprise Phase 4 Ultra Pack",
      integrationStatus: "running",
      executionStatus: result.status,
      digitalTwinHealth: result.twin.healthScore,
      planningReadiness: result.plan.readinessScore,
      reasoningConfidence: result.reasoning.confidence,
      decisionApproved: result.decision.approved,
      strategyScore: result.strategy.score,
      resilienceScore: result.resilience.resilienceScore,
      workflowStatus: result.workflow.status,
      governanceScore: result.governance.governanceScore,
      optimizedScore: result.optimization.optimizedScore,
      capabilities: 10,
    };
  }
}
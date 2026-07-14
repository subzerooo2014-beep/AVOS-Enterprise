import { Controller, Get, Post } from "@nestjs/common";
import { EnterprisePhase6UltraOrchestratorService } from "./enterprise-phase-6-ultra-orchestrator.service";

@Controller("enterprise-phase-6-ultra")
export class EnterprisePhase6UltraController {
  constructor(
    private readonly orchestrator: EnterprisePhase6UltraOrchestratorService,
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
      system: "AVOS Enterprise Phase 6 Ultra Pack",
      integrationStatus: "running",
      executionStatus: result.status,
      ecosystemFitness: result.ecosystem.fitnessScore,
      valueCreationApproved: result.valueCreation.approved,
      predictedDemand: result.demand.predictedDemand,
      collaborationScore: result.collaboration.collaborationScore,
      marketplaceScore: result.marketplace.marketplaceScore,
      conversionProbability: result.journey.conversionProbability,
      orchestrationScore: result.services.orchestrationScore,
      optimizedPrice: result.pricing.optimizedPrice,
      evolutionIndex: result.evolution.overall,
      capabilities: 10,
    };
  }
}
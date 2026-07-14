import { Controller, Get, Post } from "@nestjs/common";
import { EnterprisePhase5UltraOrchestratorService } from "./enterprise-phase-5-ultra-orchestrator.service";
@Controller("enterprise-phase-5-ultra")
export class EnterprisePhase5UltraController {
  constructor(private readonly orchestrator: EnterprisePhase5UltraOrchestratorService) {}
  @Get("status") status() { return this.orchestrator.status(); }
  @Post("bootstrap") bootstrap() { return this.orchestrator.bootstrap(); }
  @Post("smoke") smoke() {
    const result = this.orchestrator.run();
    return { success: result.success, system: "AVOS Enterprise Phase 5 Ultra Pack", integrationStatus: "running", executionStatus: result.status, brainConfidence: result.brain.confidence, decisionApproved: result.decision.approved, constitutionCompliant: result.constitution.compliant, riskScore: result.risk.riskIntelligenceScore, financialScore: result.finance.financialIntelligenceScore, growthScore: result.growth.growthIntelligenceScore, marketplaceScore: result.marketplace.marketplaceIntelligenceScore, orchestrationScore: result.global.orchestrationScore, overallScore: result.overall, capabilities: 10 };
  }
}
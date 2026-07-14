import { Controller, Get, Post } from "@nestjs/common";
import { AvosProductFinalOrchestratorService } from "./avos-product-final-orchestrator.service";

@Controller("avos-product-final")
export class AvosProductFinalController {
  constructor(
    private readonly orchestrator: AvosProductFinalOrchestratorService,
  ) {}

  @Get("status")
  status() {
    return this.orchestrator.status();
  }

  @Post("smoke")
  smoke() {
    const result = this.orchestrator.run();

    return {
      success: result.success,
      system: "AVOS Product Final Pack",
      integrationStatus: "running",
      executionStatus: result.status,
      productCoreScore: result.productCore.score,
      aiExperienceScore: result.aiExperience.score,
      commerceScore: result.commerce.score,
      uiDeploymentScore: result.uiDeployment.score,
      certificationPassed: result.certification.passed,
      certificationScore: result.certification.score,
      releaseCandidate: result.certification.releaseCandidate,
      capabilities: 22,
    };
  }
}
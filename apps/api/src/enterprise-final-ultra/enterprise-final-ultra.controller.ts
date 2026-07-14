import { Controller, Get, Post } from "@nestjs/common";
import { EnterpriseFinalUltraOrchestratorService } from "./enterprise-final-ultra-orchestrator.service";

@Controller("enterprise-final-ultra")
export class EnterpriseFinalUltraController {
  constructor(
    private readonly orchestrator: EnterpriseFinalUltraOrchestratorService,
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
      system: "AVOS Enterprise Final Ultra Pack",
      integrationStatus: "running",
      executionStatus: result.status,
      swarmCoordinated: result.swarm.coordinated,
      agentsStatus: result.agents.status,
      boardApproved: result.board.approved,
      voiceReady: result.voice.ready,
      digitalHumanStatus: result.digitalHuman.status,
      multimodalFused: result.multimodal.fused,
      evolutionApproved: result.evolution.approved,
      codeQualityScore: result.codeImprovement.codeQualityScore,
      architectureScore: result.architectureEvolution.architectureScore,
      integrationScore: result.integration.integrationScore,
      runtimeScore: result.runtime.runtimeScore,
      certificationPassed: result.certification.passed,
      certificationScore: result.certification.score,
      productionLocked: result.productionLock.locked,
      releaseVersion: result.productionLock.version,
      capabilities: 13,
    };
  }
}
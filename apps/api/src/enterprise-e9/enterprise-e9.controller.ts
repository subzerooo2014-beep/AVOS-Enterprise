import { Body, Controller, Get, Post } from "@nestjs/common";
import { EnterpriseE9OrchestratorService } from "./enterprise-e9-orchestrator.service";
import { EnterpriseExecutionWaveService } from "./enterprise-execution-wave.service";
import { EnterprisePortfolioPrioritizationService } from "./enterprise-portfolio-prioritization.service";
import { EnterpriseStrategicInitiativeService } from "./enterprise-strategic-initiative.service";

@Controller("enterprise-e9")
export class EnterpriseE9Controller {
  constructor(
    private readonly orchestrator: EnterpriseE9OrchestratorService,
    private readonly initiatives: EnterpriseStrategicInitiativeService,
    private readonly portfolioService: EnterprisePortfolioPrioritizationService,
    private readonly waves: EnterpriseExecutionWaveService,
  ) {}

  @Get("status")
  status() {
    return this.orchestrator.status();
  }

  @Post("bootstrap")
  bootstrap() {
    return this.orchestrator.bootstrap();
  }

  @Post("initiatives")
  createInitiative(
    @Body()
    body: {
      name?: string;
      domain?: string;
      objective?: string;
      valueScore?: number;
      urgencyScore?: number;
      riskScore?: number;
    },
  ) {
    return this.initiatives.create(body || {});
  }

  @Get("initiatives")
  listInitiatives() {
    return this.initiatives.list();
  }

  @Get("portfolio")
  portfolio() {
    return {
      ranked: this.portfolioService.rank(),
      portfolioValueScore: this.portfolioService.portfolioValueScore(),
    };
  }

  @Get("waves")
  listWaves() {
    return this.waves.list();
  }

  @Get("snapshot")
  snapshot() {
    return this.orchestrator.snapshot();
  }

  @Post("smoke")
  smoke() {
    const result = this.orchestrator.run();
    const snapshot = this.orchestrator.snapshot();

    return {
      success: result.success,
      system: "AVOS Enterprise Mega Bundle E9",
      integrationStatus: "running",
      strategyStatus: result.status,
      governanceApproved: result.governance.approved,
      executionWaveApproved: result.wave.approved,
      executionWaveReadiness: result.wave.readinessScore,
      portfolioValueScore: result.portfolioValueScore,
      strategyReadiness: snapshot.strategyReadiness,
      activeInitiatives: snapshot.activeInitiatives,
      capabilities: 7,
    };
  }
}
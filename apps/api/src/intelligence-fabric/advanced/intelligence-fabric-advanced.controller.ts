import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from "@nestjs/common";
import {
  AdaptiveCoordinationRequest,
  EnterpriseDecisionRequest,
} from "./contracts/advanced-intelligence.contracts";
import { AdaptiveIntelligenceCoordinatorService } from "./if3/adaptive-intelligence-coordinator.service";
import { AdaptiveIntelligenceHealthService } from "./if3/adaptive-intelligence-health.service";
import { AdaptiveLearningMemoryService } from "./if3/adaptive-learning-memory.service";
import { IntelligenceAgentRegistryService } from "./if4/intelligence-agent-registry.service";
import { MultiAgentHealthService } from "./if4/multi-agent-health.service";
import { MultiAgentTaskOrchestratorService } from "./if4/multi-agent-task-orchestrator.service";
import { DecisionGovernanceService } from "./if5/decision-governance.service";
import { EnterpriseDecisionHealthService } from "./if5/enterprise-decision-health.service";
import { EnterpriseDecisionIntelligenceService } from "./if5/enterprise-decision-intelligence.service";
import { IntelligenceEvolutionEngineService } from "./if6/intelligence-evolution-engine.service";
import { IntelligenceFabricFinalCertificationService } from "./if6/intelligence-fabric-final-certification.service";
import { IntelligenceFabricFinalReviewService } from "./if6/intelligence-fabric-final-review.service";

@Controller("avos/intelligence-fabric/advanced")
export class IntelligenceFabricAdvancedController {
  constructor(
    private readonly learning: AdaptiveLearningMemoryService,
    private readonly coordinator: AdaptiveIntelligenceCoordinatorService,
    private readonly adaptiveHealth: AdaptiveIntelligenceHealthService,
    private readonly agents: IntelligenceAgentRegistryService,
    private readonly multiAgent: MultiAgentTaskOrchestratorService,
    private readonly multiAgentHealth: MultiAgentHealthService,
    private readonly decisions: EnterpriseDecisionIntelligenceService,
    private readonly governance: DecisionGovernanceService,
    private readonly decisionHealth: EnterpriseDecisionHealthService,
    private readonly evolution: IntelligenceEvolutionEngineService,
    private readonly review: IntelligenceFabricFinalReviewService,
    private readonly certification: IntelligenceFabricFinalCertificationService,
  ) {}

  @Post("if3/coordinate")
  @HttpCode(HttpStatus.OK)
  coordinate(@Body() request: AdaptiveCoordinationRequest) {
    return this.coordinator.coordinate(request);
  }

  @Get("if3/learning")
  getLearning(@Query("limit") limit?: string) {
    const parsed = Number(limit ?? 100);
    return {
      total: this.learning.count(),
      profiles: this.learning.profiles(),
      signals: this.learning.list(Number.isFinite(parsed) ? parsed : 100),
    };
  }

  @Get("if3/health")
  getAdaptiveHealth() {
    return this.adaptiveHealth.snapshot();
  }

  @Get("if4/agents")
  getAgents() {
    return {
      total: this.agents.list().length,
      agents: this.agents.list(),
    };
  }

  @Post("if4/execute")
  @HttpCode(HttpStatus.OK)
  executeAgents(@Body() body: { objective: string }) {
    return this.multiAgent.execute(body.objective);
  }

  @Get("if4/tasks")
  getTasks(@Query("limit") limit?: string) {
    const parsed = Number(limit ?? 100);
    return {
      tasks: this.multiAgent.listTasks(
        Number.isFinite(parsed) ? parsed : 100,
      ),
    };
  }

  @Get("if4/health")
  getMultiAgentHealth() {
    return this.multiAgentHealth.snapshot();
  }

  @Post("if5/decide")
  @HttpCode(HttpStatus.OK)
  decide(@Body() request: EnterpriseDecisionRequest) {
    const decision = this.decisions.decide(request);
    return {
      decision,
      governance: this.governance.evaluate(decision),
    };
  }

  @Get("if5/decisions")
  getDecisions(@Query("limit") limit?: string) {
    const parsed = Number(limit ?? 100);
    return {
      total: this.decisions.count(),
      decisions: this.decisions.list(
        Number.isFinite(parsed) ? parsed : 100,
      ),
    };
  }

  @Get("if5/health")
  getDecisionHealth() {
    return this.decisionHealth.snapshot();
  }

  @Get("if6/evolution")
  getEvolution() {
    return this.evolution.snapshot();
  }

  @Post("if6/final-review/run")
  @HttpCode(HttpStatus.OK)
  runFinalReview() {
    return this.review.run();
  }

  @Post("if6/certification/certify")
  @HttpCode(HttpStatus.OK)
  certify() {
    return this.certification.certify();
  }

  @Get("if6/certification/status")
  getCertificationStatus() {
    return this.certification.status();
  }
}
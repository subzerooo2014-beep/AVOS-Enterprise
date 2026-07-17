import { Injectable } from "@nestjs/common";
import { AdaptiveIntelligenceHealthService } from "../if3/adaptive-intelligence-health.service";
import { AdaptiveIntelligenceCoordinatorService } from "../if3/adaptive-intelligence-coordinator.service";
import { MultiAgentHealthService } from "../if4/multi-agent-health.service";
import { MultiAgentTaskOrchestratorService } from "../if4/multi-agent-task-orchestrator.service";
import { DecisionGovernanceService } from "../if5/decision-governance.service";
import { EnterpriseDecisionHealthService } from "../if5/enterprise-decision-health.service";
import { EnterpriseDecisionIntelligenceService } from "../if5/enterprise-decision-intelligence.service";
import { IntelligenceEvolutionEngineService } from "./intelligence-evolution-engine.service";

@Injectable()
export class IntelligenceFabricFinalReviewService {
  private latest?: Record<string, unknown>;

  constructor(
    private readonly coordinator: AdaptiveIntelligenceCoordinatorService,
    private readonly adaptiveHealth: AdaptiveIntelligenceHealthService,
    private readonly multiAgent: MultiAgentTaskOrchestratorService,
    private readonly multiAgentHealth: MultiAgentHealthService,
    private readonly decisions: EnterpriseDecisionIntelligenceService,
    private readonly governance: DecisionGovernanceService,
    private readonly decisionHealth: EnterpriseDecisionHealthService,
    private readonly evolution: IntelligenceEvolutionEngineService,
  ) {}

  async run(): Promise<Record<string, unknown>> {
    const adaptive = await this.coordinator.coordinate({
      objective: "Evaluate enterprise intelligence maturity and readiness",
      domain: "knowledge",
      capability: "evidence-analysis",
      requireHumanApproval: true,
    });

    const agentRun = await this.multiAgent.execute(
      "research analysis risk decision",
    );

    const decision = this.decisions.decide({
      objective: "Approve AVOS Intelligence Fabric IF-3 to IF-6",
      domain: "enterprise",
      options: ["certify", "hold", "reject"],
      risk: "medium",
      evidenceScore: 1,
      requireHumanApproval: true,
    });

    const governance = this.governance.evaluate(decision);
    const adaptiveHealth = this.adaptiveHealth.snapshot();
    const multiAgentHealth = this.multiAgentHealth.snapshot();
    const decisionHealth = this.decisionHealth.snapshot();

    const checks = {
      adaptiveCoordinationOperational: adaptive.id.length > 0,
      adaptiveHealthHealthy: adaptiveHealth.status === "healthy",
      multiAgentCompleted: agentRun.status === "completed",
      multiAgentHealthHealthy: multiAgentHealth.status === "healthy",
      enterpriseDecisionCreated: decision.id.length > 0,
      governanceApproved: governance.status === "approved",
      decisionHealthHealthy: decisionHealth.status === "healthy",
      humanAuthorityPreserved: decision.requiresHumanApproval === true,
    };

    const score = Math.round(
      (Object.values(checks).filter(Boolean).length /
        Object.values(checks).length) *
        100,
    );

    this.latest = {
      id: `intelligence-fabric-if6-final-review:${Date.now()}`,
      status: Object.values(checks).every(Boolean) ? "passed" : "failed",
      score,
      checks,
      adaptive,
      agentRun,
      decision,
      governance,
      evolution: this.evolution.snapshot("under-review"),
      reviewedAt: new Date().toISOString(),
    };

    return this.latest;
  }

  getLatest(): Record<string, unknown> | undefined {
    return this.latest;
  }
}
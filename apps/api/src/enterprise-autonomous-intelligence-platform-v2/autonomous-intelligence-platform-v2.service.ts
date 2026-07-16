import { Injectable } from "@nestjs/common";
import { AiDecisionOrchestratorV2Service } from "./ai-decision-orchestrator-v2.service";
import { AutonomousPlanningV2Service } from "./autonomous-planning-v2.service";
import { ContinuousLearningV2Service } from "./continuous-learning-v2.service";
import { IntelligenceAgentRegistryV2Service } from "./intelligence-agent-registry-v2.service";
import { MultiAgentCollaborationV2Service } from "./multi-agent-collaboration-v2.service";
import { PredictiveIntelligenceV2Service } from "./predictive-intelligence-v2.service";
import type {
  AutonomousIntelligenceHealthV2,
  AutonomousIntelligenceMetricsV2,
} from "./autonomous-intelligence-v2.types";

@Injectable()
export class AutonomousIntelligencePlatformV2Service {
  constructor(
    private readonly agents: IntelligenceAgentRegistryV2Service,
    private readonly plans: AutonomousPlanningV2Service,
    private readonly decisions: AiDecisionOrchestratorV2Service,
    private readonly collaboration: MultiAgentCollaborationV2Service,
    private readonly learning: ContinuousLearningV2Service,
    private readonly predictive: PredictiveIntelligenceV2Service,
  ) {}

  metrics(): AutonomousIntelligenceMetricsV2 {
    return {
      agents: this.agents.count(),
      activeAgents: this.agents.activeCount(),
      plans: this.plans.count(),
      activePlans: this.plans.activeCount(),
      failedPlans: this.plans.failedCount(),
      decisions: this.decisions.count(),
      collaborations: this.collaboration.count(),
      learnings: this.learning.count(),
      predictions: this.predictive.count(),
    };
  }

  health(): AutonomousIntelligenceHealthV2 {
    const metrics = this.metrics();

    return {
      success: true,
      system: "AVOS Enterprise Autonomous Intelligence Platform V2",
      version: "2.0.0",
      status: metrics.failedPlans > 0 ? "DEGRADED" : "READY",
      metrics,
      components: {
        autonomousIntelligenceCore: "READY",
        aiDecisionOrchestrator: "READY",
        multiAgentCollaboration: "READY",
        autonomousPlanningEngine: "READY",
        continuousLearningCenter: "READY",
        predictiveIntelligenceHub: "READY",
        intelligenceAnalytics: "READY",
      },
    };
  }

  diagnostics() {
    return {
      success: true,
      health: this.health(),
      agents: this.agents.list(),
      plans: this.plans.list(),
      decisions: this.decisions.list(),
      collaborations: this.collaboration.list(),
      learnings: this.learning.list(),
      predictions: this.predictive.list(),
    };
  }
}

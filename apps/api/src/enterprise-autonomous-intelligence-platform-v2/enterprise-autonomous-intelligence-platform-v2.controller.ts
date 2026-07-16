import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { AiDecisionOrchestratorV2Service } from "./ai-decision-orchestrator-v2.service";
import { AutonomousIntelligencePlatformV2Service } from "./autonomous-intelligence-platform-v2.service";
import { AutonomousPlanningV2Service } from "./autonomous-planning-v2.service";
import { ContinuousLearningV2Service } from "./continuous-learning-v2.service";
import { IntelligenceAgentRegistryV2Service } from "./intelligence-agent-registry-v2.service";
import { MultiAgentCollaborationV2Service } from "./multi-agent-collaboration-v2.service";
import { PredictiveIntelligenceV2Service } from "./predictive-intelligence-v2.service";
import type { IntelligenceAgentV2 } from "./autonomous-intelligence-v2.types";

@Controller("enterprise-autonomous-intelligence-platform-v2")
export class EnterpriseAutonomousIntelligencePlatformV2Controller {
  constructor(
    private readonly platform: AutonomousIntelligencePlatformV2Service,
    private readonly agents: IntelligenceAgentRegistryV2Service,
    private readonly plans: AutonomousPlanningV2Service,
    private readonly decisions: AiDecisionOrchestratorV2Service,
    private readonly collaboration: MultiAgentCollaborationV2Service,
    private readonly learning: ContinuousLearningV2Service,
    private readonly predictive: PredictiveIntelligenceV2Service,
  ) {}

  @Get("status")
  status() {
    return this.platform.health();
  }

  @Get("diagnostics")
  diagnostics() {
    return this.platform.diagnostics();
  }

  @Post("agents")
  registerAgent(
    @Body() body: Omit<IntelligenceAgentV2, "createdAt" | "updatedAt">,
  ) {
    return { success: true, agent: this.agents.register(body) };
  }

  @Post("plans")
  createPlan(
    @Body()
    body: {
      objective: string;
      steps: string[];
      agentIds: string[];
      context?: Record<string, unknown>;
    },
  ) {
    return {
      success: true,
      plan: this.plans.create(
        body.objective,
        body.steps,
        body.agentIds,
        body.context,
      ),
    };
  }

  @Post("plans/:id/start")
  startPlan(@Param("id") id: string) {
    return { success: true, plan: this.plans.start(id) };
  }

  @Post("plans/:id/advance")
  advancePlan(@Param("id") id: string) {
    return { success: true, plan: this.plans.advance(id) };
  }

  @Post("plans/:id/decisions")
  decide(
    @Param("id") id: string,
    @Body()
    body: {
      action: string;
      riskScore: number;
      confidence: number;
    },
  ) {
    return {
      success: true,
      decision: this.decisions.decide(
        id,
        body.action,
        body.riskScore,
        body.confidence,
      ),
    };
  }

  @Post("collaborations")
  collaborate(
    @Body()
    body: {
      senderId: string;
      receiverId: string;
      topic: string;
      payload: Record<string, unknown>;
    },
  ) {
    return {
      success: true,
      message: this.collaboration.send(
        body.senderId,
        body.receiverId,
        body.topic,
        body.payload,
      ),
    };
  }

  @Post("learnings")
  learn(
    @Body()
    body: {
      sourceId: string;
      lesson: string;
      score: number;
      metadata?: Record<string, unknown>;
    },
  ) {
    return {
      success: true,
      learning: this.learning.record(
        body.sourceId,
        body.lesson,
        body.score,
        body.metadata,
      ),
    };
  }

  @Post("predictions")
  predict(
    @Body()
    body: {
      category: string;
      values: number[];
      summary: string;
      factors?: string[];
    },
  ) {
    return {
      success: true,
      prediction: this.predictive.generate(
        body.category,
        body.values,
        body.summary,
        body.factors,
      ),
    };
  }
}

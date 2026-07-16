import { Module } from "@nestjs/common";
import { AiDecisionOrchestratorV2Service } from "./ai-decision-orchestrator-v2.service";
import { AutonomousIntelligencePlatformV2Service } from "./autonomous-intelligence-platform-v2.service";
import { AutonomousPlanningV2Service } from "./autonomous-planning-v2.service";
import { ContinuousLearningV2Service } from "./continuous-learning-v2.service";
import { EnterpriseAutonomousIntelligencePlatformV2Controller } from "./enterprise-autonomous-intelligence-platform-v2.controller";
import { IntelligenceAgentRegistryV2Service } from "./intelligence-agent-registry-v2.service";
import { MultiAgentCollaborationV2Service } from "./multi-agent-collaboration-v2.service";
import { PredictiveIntelligenceV2Service } from "./predictive-intelligence-v2.service";

@Module({
  controllers: [EnterpriseAutonomousIntelligencePlatformV2Controller],
  providers: [
    AiDecisionOrchestratorV2Service,
    AutonomousIntelligencePlatformV2Service,
    AutonomousPlanningV2Service,
    ContinuousLearningV2Service,
    IntelligenceAgentRegistryV2Service,
    MultiAgentCollaborationV2Service,
    PredictiveIntelligenceV2Service,
  ],
  exports: [
    AiDecisionOrchestratorV2Service,
    AutonomousIntelligencePlatformV2Service,
    AutonomousPlanningV2Service,
    ContinuousLearningV2Service,
    IntelligenceAgentRegistryV2Service,
    MultiAgentCollaborationV2Service,
    PredictiveIntelligenceV2Service,
  ],
})
export class EnterpriseAutonomousIntelligencePlatformV2Module {}

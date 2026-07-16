import { Module } from "@nestjs/common";
import { CapabilityFabricModule } from "../capability-fabric/capability-fabric.module";
import { CapabilityOrchestrationModule } from "../capability-orchestration/capability-orchestration.module";
import { CapabilityRuntimeModule } from "../capability-runtime/capability-runtime.module";
import { CapabilityDuplicateDetectorService } from "./capability-duplicate-detector.service";
import { CapabilityIntelligenceController } from "./capability-intelligence.controller";
import { CapabilityIntelligenceService } from "./capability-intelligence.service";
import { CapabilityKnowledgeService } from "./capability-knowledge.service";
import { CapabilityMemoryService } from "./capability-memory.service";
import { CapabilityRecommendationService } from "./capability-recommendation.service";
import { CapabilityRiskService } from "./capability-risk.service";
import { CapabilityScoringService } from "./capability-scoring.service";
import { CapabilityUsageAnalyticsService } from "./capability-usage-analytics.service";

@Module({
  imports: [
    CapabilityFabricModule,
    CapabilityRuntimeModule,
    CapabilityOrchestrationModule,
  ],
  controllers: [CapabilityIntelligenceController],
  providers: [
    CapabilityIntelligenceService,
    CapabilityKnowledgeService,
    CapabilityMemoryService,
    CapabilityUsageAnalyticsService,
    CapabilityScoringService,
    CapabilityDuplicateDetectorService,
    CapabilityRiskService,
    CapabilityRecommendationService,
  ],
  exports: [
    CapabilityIntelligenceService,
    CapabilityKnowledgeService,
    CapabilityMemoryService,
    CapabilityUsageAnalyticsService,
    CapabilityScoringService,
    CapabilityRiskService,
  ],
})
export class CapabilityIntelligenceModule {}
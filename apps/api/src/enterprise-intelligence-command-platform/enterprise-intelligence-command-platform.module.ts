import { Module } from "@nestjs/common";
import { AutonomousOperationsService } from "./autonomous-operations.service";
import { DecisionIntelligenceService } from "./decision-intelligence.service";
import { EnterpriseDigitalTwinService } from "./enterprise-digital-twin.service";
import { EnterpriseIntelligenceCommandPlatformController } from "./enterprise-intelligence-command-platform.controller";
import { EnterpriseKnowledgeGraphService } from "./enterprise-knowledge-graph.service";
import { IntelligenceCommandCenterService } from "./intelligence-command-center.service";

@Module({
  controllers: [EnterpriseIntelligenceCommandPlatformController],
  providers: [
    AutonomousOperationsService,
    DecisionIntelligenceService,
    EnterpriseDigitalTwinService,
    EnterpriseKnowledgeGraphService,
    IntelligenceCommandCenterService,
  ],
  exports: [
    AutonomousOperationsService,
    DecisionIntelligenceService,
    EnterpriseDigitalTwinService,
    EnterpriseKnowledgeGraphService,
    IntelligenceCommandCenterService,
  ],
})
export class EnterpriseIntelligenceCommandPlatformModule {}

import { Module } from "@nestjs/common";
import { EnterpriseE4Controller } from "./enterprise-e4.controller";
import { EnterpriseE4OrchestratorService } from "./enterprise-e4-orchestrator.service";
import { EnterpriseGovernanceControlService } from "./enterprise-governance-control.service";
import { EnterpriseIncidentCommandService } from "./enterprise-incident-command.service";
import { EnterpriseOperationalIntelligenceService } from "./enterprise-operational-intelligence.service";
import { EnterpriseReliabilityIntelligenceService } from "./enterprise-reliability-intelligence.service";

@Module({
  controllers: [EnterpriseE4Controller],
  providers: [
    EnterpriseE4OrchestratorService,
    EnterpriseGovernanceControlService,
    EnterpriseIncidentCommandService,
    EnterpriseReliabilityIntelligenceService,
    EnterpriseOperationalIntelligenceService,
  ],
  exports: [
    EnterpriseE4OrchestratorService,
    EnterpriseGovernanceControlService,
    EnterpriseIncidentCommandService,
    EnterpriseReliabilityIntelligenceService,
    EnterpriseOperationalIntelligenceService,
  ],
})
export class EnterpriseE4Module {}
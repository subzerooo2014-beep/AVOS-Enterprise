import { Module } from "@nestjs/common";
import { CoreFoundationFinalController } from "./core-foundation-final.controller";
import { CoreFoundationFinalService } from "./core-foundation-final.service";

import { EnterpriseDigitalTwinService } from "./services/enterprise-digital-twin.service";
import { ArchitectureDigitalTwinService } from "./services/architecture-digital-twin.service";
import { ArchitectureDriftDetectorService } from "./services/architecture-drift-detector.service";
import { ArchitectureHealthService } from "./services/architecture-health.service";
import { FutureCompatibilityService } from "./services/future-compatibility.service";
import { StrategicPlannerService } from "./services/strategic-planner.service";
import { DecisionGraphService } from "./services/decision-graph.service";
import { DecisionGraphNodeService } from "./services/decision-graph-node.service";
import { DecisionGraphEdgeService } from "./services/decision-graph-edge.service";
import { SelfEvolutionService } from "./services/self-evolution.service";
import { ReleaseAdvisorService } from "./services/release-advisor.service";
import { PerformanceDnaService } from "./services/performance-dna.service";
import { DigitalConstitutionService } from "./services/digital-constitution.service";
import { ConstitutionalRuleService } from "./services/constitutional-rule.service";
import { GlobalOperationsCenterService } from "./services/global-operations-center.service";
import { CertificationFrameworkService } from "./services/certification-framework.service";
import { StandardsObservatoryService } from "./services/standards-observatory.service";
import { EnterpriseControlTowerService } from "./services/enterprise-control-tower.service";
import { EnterpriseTrustNetworkService } from "./services/enterprise-trust-network.service";
import { EnterpriseResilienceCenterService } from "./services/enterprise-resilience-center.service";
import { ExecutiveCommandCenterService } from "./services/executive-command-center.service";
import { GlobalIntelligenceHubService } from "./services/global-intelligence-hub.service";
import { KnowledgeProvenanceService } from "./services/knowledge-provenance.service";
import { EnterpriseReasoningArchiveService } from "./services/enterprise-reasoning-archive.service";
import { EnterpriseGenomeService } from "./services/enterprise-genome.service";
import { FoundationAuditService } from "./services/foundation-audit.service";
import { CoreFoundationDashboardService } from "./services/core-foundation-dashboard.service";

import { EnterpriseDigitalTwinRuntime } from "./runtime/enterprise-digital-twin.runtime";
import { ArchitectureDigitalTwinRuntime } from "./runtime/architecture-digital-twin.runtime";
import { StrategicPlannerRuntime } from "./runtime/strategic-planner.runtime";
import { DecisionGraphRuntime } from "./runtime/decision-graph.runtime";
import { SelfEvolutionRuntime } from "./runtime/self-evolution.runtime";
import { ReleaseAdvisorRuntime } from "./runtime/release-advisor.runtime";
import { GlobalOperationsCenterRuntime } from "./runtime/global-operations-center.runtime";
import { DigitalConstitutionRuntime } from "./runtime/digital-constitution.runtime";

@Module({
  controllers:[CoreFoundationFinalController],
  providers:[
    CoreFoundationFinalService,
    EnterpriseDigitalTwinService,ArchitectureDigitalTwinService,ArchitectureDriftDetectorService,
    ArchitectureHealthService,FutureCompatibilityService,StrategicPlannerService,DecisionGraphService,
    DecisionGraphNodeService,DecisionGraphEdgeService,SelfEvolutionService,ReleaseAdvisorService,
    PerformanceDnaService,DigitalConstitutionService,ConstitutionalRuleService,GlobalOperationsCenterService,
    CertificationFrameworkService,StandardsObservatoryService,EnterpriseControlTowerService,
    EnterpriseTrustNetworkService,EnterpriseResilienceCenterService,ExecutiveCommandCenterService,
    GlobalIntelligenceHubService,KnowledgeProvenanceService,EnterpriseReasoningArchiveService,
    EnterpriseGenomeService,FoundationAuditService,CoreFoundationDashboardService,
    EnterpriseDigitalTwinRuntime,ArchitectureDigitalTwinRuntime,StrategicPlannerRuntime,DecisionGraphRuntime,
    SelfEvolutionRuntime,ReleaseAdvisorRuntime,GlobalOperationsCenterRuntime,DigitalConstitutionRuntime
  ],
  exports:[CoreFoundationFinalService],
})
export class CoreFoundationFinalModule {}

import { Module } from "@nestjs/common";
import { EnterpriseDecisionGraphService } from "./enterprise-decision-graph.service";
import { AiStrategicPlannerService } from "./ai-strategic-planner.service";
import { EnterpriseResilienceLabService } from "./enterprise-resilience-lab.service";
import { GlobalStandardsObservatoryService } from "./global-standards-observatory.service";
import { AiEnterpriseCoachService } from "./ai-enterprise-coach.service";
import { EnterpriseKnowledgeAcademyService } from "./enterprise-knowledge-academy.service";
import { UniversalSdkIntelligenceService } from "./universal-sdk-intelligence.service";
import { EnterpriseCertificationFrameworkService } from "./enterprise-certification-framework.service";
import { LegacyPreservationSystemService } from "./legacy-preservation-system.service";
import { EnterpriseGenomeService } from "./enterprise-genome.service";
import { DigitalConstitutionEngineService } from "./digital-constitution-engine.service";
import { AiGovernanceCouncilService } from "./ai-governance-council.service";
import { PolicyEvolutionEngineService } from "./policy-evolution-engine.service";
import { DecisionAuditIntelligenceService } from "./decision-audit-intelligence.service";
import { StrategicPortfolioOrchestratorService } from "./strategic-portfolio-orchestrator.service";
import { InnovationPortfolioEngineService } from "./innovation-portfolio-engine.service";
import { CapabilityMaturityIndexService } from "./capability-maturity-index.service";
import { EnterpriseOperatingModelService } from "./enterprise-operating-model.service";
import { FutureReadinessIndexService } from "./future-readiness-index.service";

@Module({
  providers: [
    EnterpriseDecisionGraphService,
    AiStrategicPlannerService,
    EnterpriseResilienceLabService,
    GlobalStandardsObservatoryService,
    AiEnterpriseCoachService,
    EnterpriseKnowledgeAcademyService,
    UniversalSdkIntelligenceService,
    EnterpriseCertificationFrameworkService,
    LegacyPreservationSystemService,
    EnterpriseGenomeService,
    DigitalConstitutionEngineService,
    AiGovernanceCouncilService,
    PolicyEvolutionEngineService,
    DecisionAuditIntelligenceService,
    StrategicPortfolioOrchestratorService,
    InnovationPortfolioEngineService,
    CapabilityMaturityIndexService,
    EnterpriseOperatingModelService,
    FutureReadinessIndexService,
  ],
  exports: [
    EnterpriseDecisionGraphService,
    AiStrategicPlannerService,
    EnterpriseResilienceLabService,
    GlobalStandardsObservatoryService,
    AiEnterpriseCoachService,
    EnterpriseKnowledgeAcademyService,
    UniversalSdkIntelligenceService,
    EnterpriseCertificationFrameworkService,
    LegacyPreservationSystemService,
    EnterpriseGenomeService,
    DigitalConstitutionEngineService,
    AiGovernanceCouncilService,
    PolicyEvolutionEngineService,
    DecisionAuditIntelligenceService,
    StrategicPortfolioOrchestratorService,
    InnovationPortfolioEngineService,
    CapabilityMaturityIndexService,
    EnterpriseOperatingModelService,
    FutureReadinessIndexService,
  ],
})
export class VehicleStrategicIntelligenceModule {}

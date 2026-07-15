import { EnterpriseCoreModule } from "./enterprise-core/enterprise-core.module";
import { AiPlatformModule } from "./ai-platform/ai-platform.module";
import { DataPlatformModule } from "./data-platform/data-platform.module";
import { IntegrationPlatformModule } from "./integration-platform/integration-platform.module";
import { SecurityPlatformModule } from "./security-platform/security-platform.module";
import { GovernancePlatformModule } from "./governance-platform/governance-platform.module";
import { MarketplacePlatformModule } from "./marketplace-platform/marketplace-platform.module";
import { GlobalOperationsModule } from "./global-operations/global-operations.module";
import { AutomationPlatformModule } from "./automation-platform/automation-platform.module";
import { ObservabilityPlatformModule } from "./observability-platform/observability-platform.module";
import { CommercePlatformModule } from "./commerce-platform/commerce-platform.module";
import { MobilityPlatformModule } from "./mobility-platform/mobility-platform.module";
import { FinancialPlatformModule } from "./financial-platform/financial-platform.module";
import { PartnerPlatformModule } from "./partner-platform/partner-platform.module";
import { CustomerPlatformModule } from "./customer-platform/customer-platform.module";
import { LegalPlatformModule } from "./legal-platform/legal-platform.module";
import { GrowthPlatformModule } from "./growth-platform/growth-platform.module";
import { NetworkPlatformModule } from "./network-platform/network-platform.module";
import { RevenuePlatformModule } from "./revenue-platform/revenue-platform.module";
import { CloudPlatformModule } from "./cloud-platform/cloud-platform.module";
import { DeveloperPlatformModule } from "./developer-platform/developer-platform.module";
import { AgentPlatformModule } from "./agent-platform/agent-platform.module";
import { DecisionPlatformModule } from "./decision-platform/decision-platform.module";
import { KnowledgePlatformModule } from "./knowledge-platform/knowledge-platform.module";
import { DigitalTwinPlatformModule } from "./digital-twin-platform/digital-twin-platform.module";
import { SimulationPlatformModule } from "./simulation-platform/simulation-platform.module";
import { ResiliencePlatformModule } from "./resilience-platform/resilience-platform.module";
import { CompliancePlatformModule } from "./compliance-platform/compliance-platform.module";
import { IdentityPlatformModule } from "./identity-platform/identity-platform.module";
import { TrustPlatformModule } from "./trust-platform/trust-platform.module";
import { ContentPlatformModule } from "./content-platform/content-platform.module";
import { MediaPlatformModule } from "./media-platform/media-platform.module";
import { SearchPlatformModule } from "./search-platform/search-platform.module";
import { RecommendationPlatformModule } from "./recommendation-platform/recommendation-platform.module";
import { PricingPlatformModule } from "./pricing-platform/pricing-platform.module";
import { LogisticsPlatformModule } from "./logistics-platform/logistics-platform.module";
import { InsurancePlatformModule } from "./insurance-platform/insurance-platform.module";
import { BankingPlatformModule } from "./banking-platform/banking-platform.module";
import { GovernmentPlatformModule } from "./government-platform/government-platform.module";
import { SupportPlatformModule } from "./support-platform/support-platform.module";
import { AnalyticsPlatformModule } from "./analytics-platform/analytics-platform.module";
import { WorkflowPlatformModule } from "./workflow-platform/workflow-platform.module";
import { EventPlatformModule } from "./event-platform/event-platform.module";
import { StreamingPlatformModule } from "./streaming-platform/streaming-platform.module";
import { FeaturePlatformModule } from "./feature-platform/feature-platform.module";
import { ModelPlatformModule } from "./model-platform/model-platform.module";
import { PolicyPlatformModule } from "./policy-platform/policy-platform.module";
import { AuditPlatformModule } from "./audit-platform/audit-platform.module";
import { OperationsPlatformModule } from "./operations-platform/operations-platform.module";
import { InnovationPlatformModule } from "./innovation-platform/innovation-platform.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    EnterpriseCoreModule,
    AiPlatformModule,
    DataPlatformModule,
    IntegrationPlatformModule,
    SecurityPlatformModule,
    GovernancePlatformModule,
    MarketplacePlatformModule,
    GlobalOperationsModule,
    AutomationPlatformModule,
    ObservabilityPlatformModule,
    CommercePlatformModule,
    MobilityPlatformModule,
    FinancialPlatformModule,
    PartnerPlatformModule,
    CustomerPlatformModule,
    LegalPlatformModule,
    GrowthPlatformModule,
    NetworkPlatformModule,
    RevenuePlatformModule,
    CloudPlatformModule,
    DeveloperPlatformModule,
    AgentPlatformModule,
    DecisionPlatformModule,
    KnowledgePlatformModule,
    DigitalTwinPlatformModule,
    SimulationPlatformModule,
    ResiliencePlatformModule,
    CompliancePlatformModule,
    IdentityPlatformModule,
    TrustPlatformModule,
    ContentPlatformModule,
    MediaPlatformModule,
    SearchPlatformModule,
    RecommendationPlatformModule,
    PricingPlatformModule,
    LogisticsPlatformModule,
    InsurancePlatformModule,
    BankingPlatformModule,
    GovernmentPlatformModule,
    SupportPlatformModule,
    AnalyticsPlatformModule,
    WorkflowPlatformModule,
    EventPlatformModule,
    StreamingPlatformModule,
    FeaturePlatformModule,
    ModelPlatformModule,
    PolicyPlatformModule,
    AuditPlatformModule,
    OperationsPlatformModule,
    InnovationPlatformModule,
  ],
  exports: [
    EnterpriseCoreModule,
    AiPlatformModule,
    DataPlatformModule,
    IntegrationPlatformModule,
    SecurityPlatformModule,
    GovernancePlatformModule,
    MarketplacePlatformModule,
    GlobalOperationsModule,
    AutomationPlatformModule,
    ObservabilityPlatformModule,
    CommercePlatformModule,
    MobilityPlatformModule,
    FinancialPlatformModule,
    PartnerPlatformModule,
    CustomerPlatformModule,
    LegalPlatformModule,
    GrowthPlatformModule,
    NetworkPlatformModule,
    RevenuePlatformModule,
    CloudPlatformModule,
    DeveloperPlatformModule,
    AgentPlatformModule,
    DecisionPlatformModule,
    KnowledgePlatformModule,
    DigitalTwinPlatformModule,
    SimulationPlatformModule,
    ResiliencePlatformModule,
    CompliancePlatformModule,
    IdentityPlatformModule,
    TrustPlatformModule,
    ContentPlatformModule,
    MediaPlatformModule,
    SearchPlatformModule,
    RecommendationPlatformModule,
    PricingPlatformModule,
    LogisticsPlatformModule,
    InsurancePlatformModule,
    BankingPlatformModule,
    GovernmentPlatformModule,
    SupportPlatformModule,
    AnalyticsPlatformModule,
    WorkflowPlatformModule,
    EventPlatformModule,
    StreamingPlatformModule,
    FeaturePlatformModule,
    ModelPlatformModule,
    PolicyPlatformModule,
    AuditPlatformModule,
    OperationsPlatformModule,
    InnovationPlatformModule,
  ],
})
export class GalaxyBundle1GeneratedModule {}
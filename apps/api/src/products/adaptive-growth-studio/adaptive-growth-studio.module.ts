import { Module } from "@nestjs/common";
import { AdaptiveGrowthStudioController } from "./adaptive-growth-studio.controller";
import { AdaptiveGrowthStudioRegistryService } from "./foundation/adaptive-growth-studio-registry.service";
import { AdaptiveGrowthStudioBootstrapService } from "./foundation/adaptive-growth-studio-bootstrap.service";
import { StudioDomainService } from "./foundation/studio-domain.service";
import { AdaptiveGrowthStudioHealthService } from "./health/adaptive-growth-studio-health.service";
import { AdaptiveGrowthStudioRuntimeHealthService } from "./production/adaptive-growth-studio-runtime-health.service";
import { AdaptiveGrowthStudioProductionReadinessService } from "./production/adaptive-growth-studio-production-readiness.service";
import { AdaptiveGrowthStudioVerificationService } from "./verification/adaptive-growth-studio-verification.service";
import { AdaptiveGrowthStudioSmokeService } from "./smoke/adaptive-growth-studio-smoke.service";
import { AdaptiveGrowthStudioCertificationService } from "./certification/adaptive-growth-studio-certification.service";
import { ExecutiveGrowthDashboardService } from "./sections/executive-growth-dashboard.service";
import { PortfolioManagementCenterService } from "./sections/portfolio-management-center.service";
import { ProductWorkspaceService } from "./sections/product-workspace.service";
import { MarketIntelligenceCenterService } from "./sections/market-intelligence-center.service";
import { CustomerIntelligenceCenterService } from "./sections/customer-intelligence-center.service";
import { OpportunityCenterService } from "./sections/opportunity-center.service";
import { GrowthStrategyCenterService } from "./sections/growth-strategy-center.service";
import { CampaignManagementCenterService } from "./sections/campaign-management-center.service";
import { ExperimentLabService } from "./sections/experiment-lab.service";
import { PricingStudioService } from "./sections/pricing-studio.service";
import { RevenueIntelligenceCenterService } from "./sections/revenue-intelligence-center.service";
import { KpiAnalyticsCenterService } from "./sections/kpi-analytics-center.service";
import { RecommendationCenterService } from "./sections/recommendation-center.service";
import { AiCopilotService } from "./sections/ai-copilot.service";
import { ScenarioSimulatorService } from "./sections/scenario-simulator.service";
import { ContinuousOptimizationCenterService } from "./sections/continuous-optimization-center.service";
import { ApprovalGovernanceCenterService } from "./sections/approval-governance-center.service";
import { TeamCollaborationCenterService } from "./sections/team-collaboration-center.service";
import { WorkflowOrchestrationCenterService } from "./sections/workflow-orchestration-center.service";
import { NotificationAlertCenterService } from "./sections/notification-alert-center.service";
import { ReportsExecutiveBriefingsService } from "./sections/reports-executive-briefings.service";
import { ConfigurationFeatureManagementService } from "./sections/configuration-feature-management.service";
import { IntegrationCenterService } from "./sections/integration-center.service";
import { SecurityAuditCenterService } from "./sections/security-audit-center.service";
import { AdministrationTenantManagementService } from "./sections/administration-tenant-management.service";
import { DashboardEngineService } from "./shareds/dashboard-engine.service";
import { WorkspaceEngineService } from "./shareds/workspace-engine.service";
import { NavigationRegistryService } from "./shareds/navigation-registry.service";
import { WidgetRegistryService } from "./shareds/widget-registry.service";
import { LayoutEngineService } from "./shareds/layout-engine.service";
import { UserPreferenceEngineService } from "./shareds/user-preference-engine.service";
import { PersonalizationEngineService } from "./shareds/personalization-engine.service";
import { StudioSearchEngineService } from "./shareds/search-engine.service";
import { GlobalCommandPaletteService } from "./shareds/global-command-palette.service";
import { WorkspaceMemoryService } from "./shareds/workspace-memory.service";
import { ActivityTimelineService } from "./shareds/activity-timeline.service";
import { StudioNotificationEngineService } from "./shareds/notification-engine.service";
import { AiInteractionLayerService } from "./shareds/ai-interaction-layer.service";
import { AgpConnectorService } from "./shareds/agp-connector.service";
import { AdaptiveGrowthEngineConnectorService } from "./shareds/adaptive-growth-engine-connector.service";
import { HumanApprovalConnectorService } from "./shareds/human-approval-connector.service";
import { AuditConnectorService } from "./shareds/audit-connector.service";
import { TenantContextService } from "./shareds/tenant-context.service";
import { PermissionResolverService } from "./shareds/permission-resolver.service";
import { FeatureFlagManagerService } from "./shareds/feature-flag-manager.service";
import { AdaptiveGrowthStudioProductionIntegrationService } from "./production-integration/adaptive-growth-studio-production-integration.service";
import { AdaptiveGrowthStudioProductionIntegrationController } from "./production-integration/adaptive-growth-studio-production-integration.controller";
import { AdaptiveGrowthStudioLiveDataGateway } from "./live-data/adaptive-growth-studio-live-data.gateway";
import { AdaptiveGrowthStudioLiveDataNormalizer } from "./live-data/adaptive-growth-studio-live-data.normalizer";
import { AdaptiveGrowthStudioLiveDataService } from "./live-data/adaptive-growth-studio-live-data.service";
import { AdaptiveGrowthStudioLiveDataController } from "./live-data/adaptive-growth-studio-live-data.controller";

import { AdaptiveGrowthExecutionCoreModule } from "./execution-core/adaptive-growth-execution-core.module";
import { AdaptiveGrowthApprovalGovernanceModule } from "./approval-governance/adaptive-growth-approval-governance.module";
import { AdaptiveGrowthUltimatePlatformModule } from "./ultimate-platform/adaptive-growth-ultimate-platform.module";
import { AgsDurableDistributedPersistenceModule } from "./durable-distributed-persistence/ags-durable-distributed-persistence.module";
@Module({
  controllers: [
    AdaptiveGrowthStudioLiveDataController,
    AdaptiveGrowthStudioProductionIntegrationController,AdaptiveGrowthStudioController],
  providers: [
    AdaptiveGrowthStudioLiveDataService,
    AdaptiveGrowthStudioLiveDataNormalizer,
    AdaptiveGrowthStudioLiveDataGateway,
    AdaptiveGrowthStudioProductionIntegrationService,
    StudioDomainService,
    AdaptiveGrowthStudioRegistryService,
    ExecutiveGrowthDashboardService,
    PortfolioManagementCenterService,
    ProductWorkspaceService,
    MarketIntelligenceCenterService,
    CustomerIntelligenceCenterService,
    OpportunityCenterService,
    GrowthStrategyCenterService,
    CampaignManagementCenterService,
    ExperimentLabService,
    PricingStudioService,
    RevenueIntelligenceCenterService,
    KpiAnalyticsCenterService,
    RecommendationCenterService,
    AiCopilotService,
    ScenarioSimulatorService,
    ContinuousOptimizationCenterService,
    ApprovalGovernanceCenterService,
    TeamCollaborationCenterService,
    WorkflowOrchestrationCenterService,
    NotificationAlertCenterService,
    ReportsExecutiveBriefingsService,
    ConfigurationFeatureManagementService,
    IntegrationCenterService,
    SecurityAuditCenterService,
    AdministrationTenantManagementService,
    DashboardEngineService,
    WorkspaceEngineService,
    NavigationRegistryService,
    WidgetRegistryService,
    LayoutEngineService,
    UserPreferenceEngineService,
    PersonalizationEngineService,
    StudioSearchEngineService,
    GlobalCommandPaletteService,
    WorkspaceMemoryService,
    ActivityTimelineService,
    StudioNotificationEngineService,
    AiInteractionLayerService,
    AgpConnectorService,
    AdaptiveGrowthEngineConnectorService,
    HumanApprovalConnectorService,
    AuditConnectorService,
    TenantContextService,
    PermissionResolverService,
    FeatureFlagManagerService,
    AdaptiveGrowthStudioBootstrapService,
    AdaptiveGrowthStudioHealthService,
    AdaptiveGrowthStudioRuntimeHealthService,
    AdaptiveGrowthStudioVerificationService,
    AdaptiveGrowthStudioSmokeService,
    AdaptiveGrowthStudioProductionReadinessService,
    AdaptiveGrowthStudioCertificationService,
  ],
  exports: [
    AdaptiveGrowthStudioLiveDataService,
    AdaptiveGrowthStudioProductionIntegrationService,
    StudioDomainService,
    AdaptiveGrowthStudioRegistryService,
    ExecutiveGrowthDashboardService,
    PortfolioManagementCenterService,
    ProductWorkspaceService,
    MarketIntelligenceCenterService,
    CustomerIntelligenceCenterService,
    OpportunityCenterService,
    GrowthStrategyCenterService,
    CampaignManagementCenterService,
    ExperimentLabService,
    PricingStudioService,
    RevenueIntelligenceCenterService,
    KpiAnalyticsCenterService,
    RecommendationCenterService,
    AiCopilotService,
    ScenarioSimulatorService,
    ContinuousOptimizationCenterService,
    ApprovalGovernanceCenterService,
    TeamCollaborationCenterService,
    WorkflowOrchestrationCenterService,
    NotificationAlertCenterService,
    ReportsExecutiveBriefingsService,
    ConfigurationFeatureManagementService,
    IntegrationCenterService,
    SecurityAuditCenterService,
    AdministrationTenantManagementService,
    DashboardEngineService,
    WorkspaceEngineService,
    NavigationRegistryService,
    WidgetRegistryService,
    LayoutEngineService,
    UserPreferenceEngineService,
    PersonalizationEngineService,
    StudioSearchEngineService,
    GlobalCommandPaletteService,
    WorkspaceMemoryService,
    ActivityTimelineService,
    StudioNotificationEngineService,
    AiInteractionLayerService,
    AgpConnectorService,
    AdaptiveGrowthEngineConnectorService,
    HumanApprovalConnectorService,
    AuditConnectorService,
    TenantContextService,
    PermissionResolverService,
    FeatureFlagManagerService,
    AdaptiveGrowthStudioBootstrapService,
    AdaptiveGrowthStudioHealthService,
    AdaptiveGrowthStudioRuntimeHealthService,
    AdaptiveGrowthStudioVerificationService,
    AdaptiveGrowthStudioSmokeService,
    AdaptiveGrowthStudioProductionReadinessService,
    AdaptiveGrowthStudioCertificationService,
  ],
})
export class AdaptiveGrowthStudioModule {}
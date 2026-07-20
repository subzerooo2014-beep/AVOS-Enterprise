import { Injectable, OnModuleInit } from "@nestjs/common";
import { ExecutiveGrowthDashboardService } from "../sections/executive-growth-dashboard.service";
import { PortfolioManagementCenterService } from "../sections/portfolio-management-center.service";
import { ProductWorkspaceService } from "../sections/product-workspace.service";
import { MarketIntelligenceCenterService } from "../sections/market-intelligence-center.service";
import { CustomerIntelligenceCenterService } from "../sections/customer-intelligence-center.service";
import { OpportunityCenterService } from "../sections/opportunity-center.service";
import { GrowthStrategyCenterService } from "../sections/growth-strategy-center.service";
import { CampaignManagementCenterService } from "../sections/campaign-management-center.service";
import { ExperimentLabService } from "../sections/experiment-lab.service";
import { PricingStudioService } from "../sections/pricing-studio.service";
import { RevenueIntelligenceCenterService } from "../sections/revenue-intelligence-center.service";
import { KpiAnalyticsCenterService } from "../sections/kpi-analytics-center.service";
import { RecommendationCenterService } from "../sections/recommendation-center.service";
import { AiCopilotService } from "../sections/ai-copilot.service";
import { ScenarioSimulatorService } from "../sections/scenario-simulator.service";
import { ContinuousOptimizationCenterService } from "../sections/continuous-optimization-center.service";
import { ApprovalGovernanceCenterService } from "../sections/approval-governance-center.service";
import { TeamCollaborationCenterService } from "../sections/team-collaboration-center.service";
import { WorkflowOrchestrationCenterService } from "../sections/workflow-orchestration-center.service";
import { NotificationAlertCenterService } from "../sections/notification-alert-center.service";
import { ReportsExecutiveBriefingsService } from "../sections/reports-executive-briefings.service";
import { ConfigurationFeatureManagementService } from "../sections/configuration-feature-management.service";
import { IntegrationCenterService } from "../sections/integration-center.service";
import { SecurityAuditCenterService } from "../sections/security-audit-center.service";
import { AdministrationTenantManagementService } from "../sections/administration-tenant-management.service";
import { DashboardEngineService } from "../shareds/dashboard-engine.service";
import { WorkspaceEngineService } from "../shareds/workspace-engine.service";
import { NavigationRegistryService } from "../shareds/navigation-registry.service";
import { WidgetRegistryService } from "../shareds/widget-registry.service";
import { LayoutEngineService } from "../shareds/layout-engine.service";
import { UserPreferenceEngineService } from "../shareds/user-preference-engine.service";
import { PersonalizationEngineService } from "../shareds/personalization-engine.service";
import { StudioSearchEngineService } from "../shareds/search-engine.service";
import { GlobalCommandPaletteService } from "../shareds/global-command-palette.service";
import { WorkspaceMemoryService } from "../shareds/workspace-memory.service";
import { ActivityTimelineService } from "../shareds/activity-timeline.service";
import { StudioNotificationEngineService } from "../shareds/notification-engine.service";
import { AiInteractionLayerService } from "../shareds/ai-interaction-layer.service";
import { AgpConnectorService } from "../shareds/agp-connector.service";
import { AdaptiveGrowthEngineConnectorService } from "../shareds/adaptive-growth-engine-connector.service";
import { HumanApprovalConnectorService } from "../shareds/human-approval-connector.service";
import { AuditConnectorService } from "../shareds/audit-connector.service";
import { TenantContextService } from "../shareds/tenant-context.service";
import { PermissionResolverService } from "../shareds/permission-resolver.service";
import { FeatureFlagManagerService } from "../shareds/feature-flag-manager.service";

@Injectable()
export class AdaptiveGrowthStudioBootstrapService implements OnModuleInit {
  constructor(
    private readonly executiveGrowthDashboard: ExecutiveGrowthDashboardService,
    private readonly portfolioManagementCenter: PortfolioManagementCenterService,
    private readonly productWorkspace: ProductWorkspaceService,
    private readonly marketIntelligenceCenter: MarketIntelligenceCenterService,
    private readonly customerIntelligenceCenter: CustomerIntelligenceCenterService,
    private readonly opportunityCenter: OpportunityCenterService,
    private readonly growthStrategyCenter: GrowthStrategyCenterService,
    private readonly campaignManagementCenter: CampaignManagementCenterService,
    private readonly experimentLab: ExperimentLabService,
    private readonly pricingStudio: PricingStudioService,
    private readonly revenueIntelligenceCenter: RevenueIntelligenceCenterService,
    private readonly kpiAnalyticsCenter: KpiAnalyticsCenterService,
    private readonly recommendationCenter: RecommendationCenterService,
    private readonly aiCopilot: AiCopilotService,
    private readonly scenarioSimulator: ScenarioSimulatorService,
    private readonly continuousOptimizationCenter: ContinuousOptimizationCenterService,
    private readonly approvalGovernanceCenter: ApprovalGovernanceCenterService,
    private readonly teamCollaborationCenter: TeamCollaborationCenterService,
    private readonly workflowOrchestrationCenter: WorkflowOrchestrationCenterService,
    private readonly notificationAlertCenter: NotificationAlertCenterService,
    private readonly reportsExecutiveBriefings: ReportsExecutiveBriefingsService,
    private readonly configurationFeatureManagement: ConfigurationFeatureManagementService,
    private readonly integrationCenter: IntegrationCenterService,
    private readonly securityAuditCenter: SecurityAuditCenterService,
    private readonly administrationTenantManagement: AdministrationTenantManagementService,
    private readonly dashboardEngine: DashboardEngineService,
    private readonly workspaceEngine: WorkspaceEngineService,
    private readonly navigationRegistry: NavigationRegistryService,
    private readonly widgetRegistry: WidgetRegistryService,
    private readonly layoutEngine: LayoutEngineService,
    private readonly userPreferenceEngine: UserPreferenceEngineService,
    private readonly personalizationEngine: PersonalizationEngineService,
    private readonly studioSearchEngine: StudioSearchEngineService,
    private readonly globalCommandPalette: GlobalCommandPaletteService,
    private readonly workspaceMemory: WorkspaceMemoryService,
    private readonly activityTimeline: ActivityTimelineService,
    private readonly studioNotificationEngine: StudioNotificationEngineService,
    private readonly aiInteractionLayer: AiInteractionLayerService,
    private readonly agpConnector: AgpConnectorService,
    private readonly adaptiveGrowthEngineConnector: AdaptiveGrowthEngineConnectorService,
    private readonly humanApprovalConnector: HumanApprovalConnectorService,
    private readonly auditConnector: AuditConnectorService,
    private readonly tenantContext: TenantContextService,
    private readonly permissionResolver: PermissionResolverService,
    private readonly featureFlagManager: FeatureFlagManagerService,
  ) {}

  onModuleInit() {
    this.initialize();
  }

  initialize() {
    const services = [
      this.executiveGrowthDashboard,
      this.portfolioManagementCenter,
      this.productWorkspace,
      this.marketIntelligenceCenter,
      this.customerIntelligenceCenter,
      this.opportunityCenter,
      this.growthStrategyCenter,
      this.campaignManagementCenter,
      this.experimentLab,
      this.pricingStudio,
      this.revenueIntelligenceCenter,
      this.kpiAnalyticsCenter,
      this.recommendationCenter,
      this.aiCopilot,
      this.scenarioSimulator,
      this.continuousOptimizationCenter,
      this.approvalGovernanceCenter,
      this.teamCollaborationCenter,
      this.workflowOrchestrationCenter,
      this.notificationAlertCenter,
      this.reportsExecutiveBriefings,
      this.configurationFeatureManagement,
      this.integrationCenter,
      this.securityAuditCenter,
      this.administrationTenantManagement,
      this.dashboardEngine,
      this.workspaceEngine,
      this.navigationRegistry,
      this.widgetRegistry,
      this.layoutEngine,
      this.userPreferenceEngine,
      this.personalizationEngine,
      this.studioSearchEngine,
      this.globalCommandPalette,
      this.workspaceMemory,
      this.activityTimeline,
      this.studioNotificationEngine,
      this.aiInteractionLayer,
      this.agpConnector,
      this.adaptiveGrowthEngineConnector,
      this.humanApprovalConnector,
      this.auditConnector,
      this.tenantContext,
      this.permissionResolver,
      this.featureFlagManager,
    ];
    return services.map((service) => service.initialize());
  }
}
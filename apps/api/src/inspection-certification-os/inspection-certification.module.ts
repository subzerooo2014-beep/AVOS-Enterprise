import { InspectionFileSystemService } from "./inspection-file-system.service";
import { DeltaComparisonEngineService } from "./omega/executive/delta-comparison-engine.service";
import { ExecutiveDashboardService } from "./omega/executive/executive-dashboard.service";
import { ExecutiveKpiEngineService } from "./omega/executive/executive-kpi-engine.service";
import { HistoricalTimelineService } from "./omega/executive/historical-timeline.service";
import { OmegaExecutiveController } from "./omega/executive/omega-executive.controller";
import { OmegaExecutiveFacadeService } from "./omega/executive/omega-executive-facade.service";
import { TrendAnalyticsEngineService } from "./omega/executive/trend-analytics-engine.service";
import { ApprovalWorkflowService } from "./omega/workflow/approval-workflow.service";
import { CertificationLifecycleManagerService } from "./omega/workflow/certification-lifecycle-manager.service";
import { CertificationStateMachineService } from "./omega/workflow/certification-state-machine.service";
import { CertificationWorkflowService } from "./omega/workflow/certification-workflow.service";
import { OmegaWorkflowController } from "./omega/workflow/omega-workflow.controller";
import { OmegaWorkflowFacadeService } from "./omega/workflow/omega-workflow-facade.service";
import { WorkflowAssignmentEngineService } from "./omega/workflow/workflow-assignment-engine.service";
import { WorkflowOrchestratorService } from "./omega/workflow/workflow-orchestrator.service";
import { ActionPlanGeneratorService } from "./omega/remediation/action-plan-generator.service";
import { AutoFixPlannerService } from "./omega/remediation/auto-fix-planner.service";
import { FindingRegistryService } from "./omega/remediation/finding-registry.service";
import { IssueRegistryService } from "./omega/remediation/issue-registry.service";
import { OmegaRemediationController } from "./omega/remediation/omega-remediation.controller";
import { OmegaRemediationFacadeService } from "./omega/remediation/omega-remediation-facade.service";
import { RecommendationEngineService } from "./omega/remediation/recommendation-engine.service";
import { RemediationEngineService } from "./omega/remediation/remediation-engine.service";
import { RiskPrioritizationEngineService } from "./omega/remediation/risk-prioritization-engine.service";
import { ComplianceIntelligenceEngineService } from "./omega/governance/compliance-intelligence-engine.service";
import { DataProvenanceEngineService } from "./omega/governance/data-provenance-engine.service";
import { DecisionTraceabilityEngineService } from "./omega/governance/decision-traceability-engine.service";
import { EvidenceRegistryService } from "./omega/governance/evidence-registry.service";
import { ExplainabilityEngineService } from "./omega/governance/explainability-engine.service";
import { GovernancePolicyEngineService } from "./omega/governance/governance-policy-engine.service";
import { HumanApprovalGateService } from "./omega/governance/human-approval-gate.service";
import { ImmutableAuditLedgerService } from "./omega/governance/immutable-audit-ledger.service";
import { OmegaGovernanceController } from "./omega/governance/omega-governance.controller";
import { OmegaGovernanceOrchestratorService } from "./omega/governance/omega-governance-orchestrator.service";
import { TrustScoreEngineService } from "./omega/governance/trust-score-engine.service";
import { ArchitectureIntelligenceEngineService } from "./omega/intelligence/architecture-intelligence-engine.service";
import { CiCdIntelligenceEngineService } from "./omega/intelligence/cicd-intelligence-engine.service";
import { CodeQualityIntelligenceEngineService } from "./omega/intelligence/code-quality-intelligence-engine.service";
import { ConfigurationIntelligenceEngineService } from "./omega/intelligence/configuration-intelligence-engine.service";
import { DeadCodeIntelligenceEngineService } from "./omega/intelligence/dead-code-intelligence-engine.service";
import { DependencyGraphIntelligenceEngineService } from "./omega/intelligence/dependency-graph-intelligence-engine.service";
import { DockerIntelligenceEngineService } from "./omega/intelligence/docker-intelligence-engine.service";
import { GitIntelligenceEngineService } from "./omega/intelligence/git-intelligence-engine.service";
import { NestJsIntelligenceEngineService } from "./omega/intelligence/nestjs-intelligence-engine.service";
import { OmegaIntelligenceController } from "./omega/intelligence/omega-intelligence.controller";
import { OmegaIntelligenceFacadeService } from "./omega/intelligence/omega-intelligence-facade.service";
import { PerformanceIntelligenceEngineService } from "./omega/intelligence/performance-intelligence-engine.service";
import { PrismaIntelligenceEngineService } from "./omega/intelligence/prisma-intelligence-engine.service";
import { ProductionReadinessEngineService } from "./omega/intelligence/production-readiness-engine.service";
import { ReleaseReadinessEngineService } from "./omega/intelligence/release-readiness-engine.service";
import { SecurityIntelligenceEngineService } from "./omega/intelligence/security-intelligence-engine.service";
import { ApiInspectionEngineService } from "./omega/advanced/api-inspection-engine.service";
import { ArchitectureIntelligenceService } from "./omega/advanced/architecture-intelligence.service";
import { ConfigurationInspectionEngineService } from "./omega/advanced/configuration-inspection-engine.service";
import { DatabaseInspectionEngineService } from "./omega/advanced/database-inspection-engine.service";
import { DuplicateDetectionEngineService } from "./omega/advanced/duplicate-detection-engine.service";
import { PerformanceBaselineEngineService } from "./omega/advanced/performance-baseline-engine.service";
import { SecurityBaselineEngineService } from "./omega/advanced/security-baseline-engine.service";
import { TechnicalDebtEngineService } from "./omega/advanced/technical-debt-engine.service";
import { OmegaCertificationCenterService } from "./omega/certification/omega-certification-center.service";
import { OmegaController } from "./omega/omega.controller";
import { OmegaDashboardService } from "./omega/dashboard/omega-dashboard.service";
import { OmegaPolicyEngineService } from "./omega/engines/omega-policy-engine.service";
import { OmegaReadinessEngineService } from "./omega/engines/omega-readiness-engine.service";
import { OmegaRiskEngineService } from "./omega/engines/omega-risk-engine.service";
import { OmegaRuleEngineService } from "./omega/engines/omega-rule-engine.service";
import { OmegaScoreEngineService } from "./omega/engines/omega-score-engine.service";
import { OmegaHistoryService } from "./omega/history/omega-history.service";
import { OmegaTrendEngineService } from "./omega/history/omega-trend-engine.service";
import { OmegaOrchestratorService } from "./omega/omega-orchestrator.service";
import { OmegaExecutiveReportService } from "./omega/reports/omega-executive-report.service";
import { Module, OnModuleInit } from "@nestjs/common";
import { CertificationEngineService } from "./certification-engine.service";
import { ClassificationEngineService } from "./classification-engine.service";
import { EvidenceCollectorService } from "./evidence-collector.service";
import { InspectionCertificationController } from "./inspection-certification.controller";
import { InspectionContextFactory } from "./inspection-context.factory";
import { InspectionEngineService } from "./inspection-engine.service";
import { InspectionPluginRegistryService } from "./inspection-plugin-registry.service";
import { InspectionPolicyService } from "./inspection-policy.service";
import { InspectionRegistryService } from "./inspection-registry.service";
import { InspectionReportService } from "./inspection-report.service";
import { InspectionRuntimeService } from "./inspection-runtime.service";
import { ApiBuildInspectionPlugin } from "./plugins/api-build.plugin";
import { ArchitectureBoundaryInspectionPlugin } from "./plugins/architecture-boundary.plugin";
import { DependencyHealthInspectionPlugin } from "./plugins/dependency-health.plugin";
import { DocumentationInspectionPlugin } from "./plugins/documentation.plugin";
import { FoundationContractInspectionPlugin } from "./plugins/foundation-contract.plugin";
import { GitInspectionPlugin } from "./plugins/git.plugin";
import { PrismaInspectionPlugin } from "./plugins/prisma.plugin";
import { RepositoryStructureInspectionPlugin } from "./plugins/repository-structure.plugin";
import { RuntimeHealthInspectionPlugin } from "./plugins/runtime-health.plugin";
import { SecretPatternInspectionPlugin } from "./plugins/secret-pattern.plugin";
import { TypeScriptInspectionPlugin } from "./plugins/typescript.plugin";
import { FileSystemInspectorService } from "./shared/file-system-inspector.service";
import { InspectionCommandRunnerService } from "./shared/inspection-command-runner.service";
import { ScoreEngineService } from "./score-engine.service";

@Module({
  controllers: [InspectionCertificationController, OmegaController, OmegaIntelligenceController, OmegaGovernanceController, OmegaRemediationController, OmegaWorkflowController, OmegaExecutiveController],
  providers: [
    InspectionFileSystemService,
    InspectionCommandRunnerService,
    HistoricalTimelineService,
    ExecutiveKpiEngineService,
    TrendAnalyticsEngineService,
    DeltaComparisonEngineService,
    ExecutiveDashboardService,
    OmegaExecutiveFacadeService,
    CertificationStateMachineService,
    CertificationWorkflowService,
    CertificationLifecycleManagerService,
    ApprovalWorkflowService,
    WorkflowAssignmentEngineService,
    WorkflowOrchestratorService,
    OmegaWorkflowFacadeService,
    FindingRegistryService,
    IssueRegistryService,
    RiskPrioritizationEngineService,
    RecommendationEngineService,
    ActionPlanGeneratorService,
    AutoFixPlannerService,
    RemediationEngineService,
    OmegaRemediationFacadeService,
    EvidenceRegistryService,
    DataProvenanceEngineService,
    ImmutableAuditLedgerService,
    GovernancePolicyEngineService,
    ComplianceIntelligenceEngineService,
    TrustScoreEngineService,
    ExplainabilityEngineService,
    DecisionTraceabilityEngineService,
    HumanApprovalGateService,
    OmegaGovernanceOrchestratorService,
    ArchitectureIntelligenceEngineService,
    DependencyGraphIntelligenceEngineService,
    CodeQualityIntelligenceEngineService,
    DeadCodeIntelligenceEngineService,
    SecurityIntelligenceEngineService,
    ConfigurationIntelligenceEngineService,
    NestJsIntelligenceEngineService,
    PrismaIntelligenceEngineService,
    PerformanceIntelligenceEngineService,
    DockerIntelligenceEngineService,
    CiCdIntelligenceEngineService,
    GitIntelligenceEngineService,
    ReleaseReadinessEngineService,
    ProductionReadinessEngineService,
    OmegaIntelligenceFacadeService,
    OmegaRuleEngineService,
    OmegaPolicyEngineService,
    OmegaScoreEngineService,
    OmegaRiskEngineService,
    OmegaReadinessEngineService,
    OmegaHistoryService,
    OmegaTrendEngineService,
    OmegaCertificationCenterService,
    OmegaDashboardService,
    OmegaExecutiveReportService,
    OmegaOrchestratorService,
    ArchitectureIntelligenceService,
    TechnicalDebtEngineService,
    DuplicateDetectionEngineService,
    ConfigurationInspectionEngineService,
    ApiInspectionEngineService,
    DatabaseInspectionEngineService,
    SecurityBaselineEngineService,
    PerformanceBaselineEngineService,
    InspectionRegistryService,
    InspectionEngineService,
    ScoreEngineService,
    ClassificationEngineService,
    CertificationEngineService,
    InspectionPluginRegistryService,
    InspectionContextFactory,
    EvidenceCollectorService,
    InspectionRuntimeService,
    InspectionPolicyService,
    InspectionReportService,
    InspectionCommandRunnerService,
    FileSystemInspectorService,
    FoundationContractInspectionPlugin,
    RuntimeHealthInspectionPlugin,
    RepositoryStructureInspectionPlugin,
    TypeScriptInspectionPlugin,
    ApiBuildInspectionPlugin,
    PrismaInspectionPlugin,
    GitInspectionPlugin,
    DependencyHealthInspectionPlugin,
    SecretPatternInspectionPlugin,
    DocumentationInspectionPlugin,
    ArchitectureBoundaryInspectionPlugin,
  ],
  exports: [
    InspectionFileSystemService,
    InspectionCommandRunnerService,
    HistoricalTimelineService,
    ExecutiveKpiEngineService,
    TrendAnalyticsEngineService,
    DeltaComparisonEngineService,
    ExecutiveDashboardService,
    OmegaExecutiveFacadeService,
    CertificationStateMachineService,
    CertificationWorkflowService,
    CertificationLifecycleManagerService,
    ApprovalWorkflowService,
    WorkflowOrchestratorService,
    OmegaWorkflowFacadeService,
    FindingRegistryService,
    IssueRegistryService,
    RiskPrioritizationEngineService,
    RecommendationEngineService,
    RemediationEngineService,
    OmegaRemediationFacadeService,
    EvidenceRegistryService,
    DataProvenanceEngineService,
    ImmutableAuditLedgerService,
    GovernancePolicyEngineService,
    ComplianceIntelligenceEngineService,
    HumanApprovalGateService,
    OmegaGovernanceOrchestratorService,
    ArchitectureIntelligenceEngineService,
    DependencyGraphIntelligenceEngineService,
    CodeQualityIntelligenceEngineService,
    SecurityIntelligenceEngineService,
    PerformanceIntelligenceEngineService,
    ProductionReadinessEngineService,
    OmegaIntelligenceFacadeService,
    OmegaRuleEngineService,
    OmegaPolicyEngineService,
    OmegaScoreEngineService,
    OmegaRiskEngineService,
    OmegaReadinessEngineService,
    OmegaHistoryService,
    OmegaTrendEngineService,
    OmegaCertificationCenterService,
    OmegaDashboardService,
    OmegaExecutiveReportService,
    OmegaOrchestratorService,
    InspectionRegistryService,
    InspectionEngineService,
    ScoreEngineService,
    ClassificationEngineService,
    CertificationEngineService,
    InspectionPluginRegistryService,
    InspectionContextFactory,
    EvidenceCollectorService,
    InspectionRuntimeService,
    InspectionPolicyService,
    InspectionReportService,
  ],
})
export class InspectionCertificationModule implements OnModuleInit {
  constructor(
    private readonly pluginRegistry: InspectionPluginRegistryService,
    private readonly foundationPlugin: FoundationContractInspectionPlugin,
    private readonly runtimeHealthPlugin: RuntimeHealthInspectionPlugin,
    private readonly repositoryPlugin: RepositoryStructureInspectionPlugin,
    private readonly typeScriptPlugin: TypeScriptInspectionPlugin,
    private readonly apiBuildPlugin: ApiBuildInspectionPlugin,
    private readonly prismaPlugin: PrismaInspectionPlugin,
    private readonly gitPlugin: GitInspectionPlugin,
    private readonly dependencyPlugin: DependencyHealthInspectionPlugin,
    private readonly secretPlugin: SecretPatternInspectionPlugin,
    private readonly documentationPlugin: DocumentationInspectionPlugin,
    private readonly architecturePlugin: ArchitectureBoundaryInspectionPlugin,
  ) {}

  onModuleInit(): void {
    [
      this.foundationPlugin,
      this.runtimeHealthPlugin,
      this.repositoryPlugin,
      this.typeScriptPlugin,
      this.apiBuildPlugin,
      this.prismaPlugin,
      this.gitPlugin,
      this.dependencyPlugin,
      this.secretPlugin,
      this.documentationPlugin,
      this.architecturePlugin,
    ].forEach((plugin) => this.pluginRegistry.upsert(plugin));
  }
}








import { CapabilityProductionModule } from "../avos-factory-capability-production-layer/capability-production.module";
import { AvosFactoryCoreCompletionCertificationController } from "./avos-factory-core-completion.controller";
import { AvosFactoryCoreCompletionCertificationService } from "./avos-factory-core-completion-certification.service";
import { AvosFactoryCoreCompletionHealthService } from "./avos-factory-core-completion-health.service";
import { AvosFactoryCoreCompletionSmokeService } from "./avos-factory-core-completion-smoke.service";
import { AvosFactoryCoreCompletionValidationService } from "./avos-factory-core-completion-validation.service";
import { AvosFactoryContinuousImprovementService } from "./avos-factory-continuous-improvement.service";
import { AvosFactoryDeploymentLearningService } from "./avos-factory-deployment-learning.service";
import { AvosFactoryReleaseIntelligenceController } from "./avos-factory-release-intelligence.controller";
import { AvosFactoryReleaseIntelligenceService } from "./avos-factory-release-intelligence.service";
import { AvosFactoryReleaseIntelligenceSmokeService } from "./avos-factory-release-intelligence-smoke.service";
import { AvosFactoryReleaseLearningMemoryService } from "./avos-factory-release-learning-memory.service";
import { AvosFactoryPostDeploymentVerificationService } from "./avos-factory-post-deployment-verification.service";
import { AvosFactoryRecoveryGovernanceService } from "./avos-factory-recovery-governance.service";
import { AvosFactoryReleaseHealthController } from "./avos-factory-release-health.controller";
import { AvosFactoryReleaseHealthService } from "./avos-factory-release-health.service";
import { AvosFactoryReleaseHealthSmokeService } from "./avos-factory-release-health-smoke.service";
import { AvosFactoryDeploymentExecutionService } from "./avos-factory-deployment-execution.service";
import { AvosFactoryDeploymentGovernanceController } from "./avos-factory-deployment-governance.controller";
import { AvosFactoryDeploymentPlanService } from "./avos-factory-deployment-plan.service";
import { AvosFactoryDeploymentSmokeService } from "./avos-factory-deployment-smoke.service";
import { AvosFactoryPromotionApprovalService } from "./avos-factory-promotion-approval.service";
import { AvosFactoryPromotionPolicyRegistryService } from "./avos-factory-promotion-policy-registry.service";
import { AvosFactoryCertificateRegistryService } from "./avos-factory-certificate-registry.service";
import { AvosFactoryCertificationAssessmentService } from "./avos-factory-certification-assessment.service";
import { AvosFactoryCertificationCriteriaRegistryService } from "./avos-factory-certification-criteria-registry.service";
import { AvosFactoryCertificationIntegrationController } from "./avos-factory-certification-integration.controller";
import { AvosFactoryCertificationIntegrationSmokeService } from "./avos-factory-certification-integration-smoke.service";
import { AvosFactoryReleaseGovernanceService } from "./avos-factory-release-governance.service";
import { AvosFactoryPolicyEvaluationService } from "./avos-factory-policy-evaluation.service";
import { AvosFactoryPolicyExceptionService } from "./avos-factory-policy-exception.service";
import { AvosFactorySecurityAssessmentService } from "./avos-factory-security-assessment.service";
import { AvosFactorySecurityController } from "./avos-factory-security.controller";
import { AvosFactorySecurityPolicyRegistryService } from "./avos-factory-security-policy-registry.service";
import { AvosFactorySecuritySmokeService } from "./avos-factory-security-smoke.service";
import { AvosFactoryComplianceReportingService } from "./avos-factory-compliance-reporting.service";
import { AvosFactoryDefectRegistryService } from "./avos-factory-defect-registry.service";
import { AvosFactoryQualityGateService } from "./avos-factory-quality-gate.service";
import { AvosFactoryValidationController } from "./avos-factory-validation.controller";
import { AvosFactoryValidationEngineService } from "./avos-factory-validation-engine.service";
import { AvosFactoryValidationRuleRegistryService } from "./avos-factory-validation-rule-registry.service";
import { AvosFactoryValidationSmokeService } from "./avos-factory-validation-smoke.service";
import { AvosFactoryBlueprintIntelligenceService } from "./avos-factory-blueprint-intelligence.service";
import { AvosFactoryCapabilityIntelligenceService } from "./avos-factory-capability-intelligence.service";
import { AvosFactoryEnterpriseInsightsService } from "./avos-factory-enterprise-insights.service";
import { AvosFactoryGenerationAnalyzerService } from "./avos-factory-generation-analyzer.service";
import { AvosFactoryIntelligenceController } from "./avos-factory-intelligence.controller";
import { AvosFactoryIntelligenceSmokeService } from "./avos-factory-intelligence-smoke.service";
import { AvosFactoryLearningMemoryService } from "./avos-factory-learning-memory.service";
import { AvosFactoryQualityScoringService } from "./avos-factory-quality-scoring.service";
import { AvosFactoryRecommendationEngineService } from "./avos-factory-recommendation-engine.service";
import { AvosFactoryTemplateIntelligenceService } from "./avos-factory-template-intelligence.service";
import { AvosFactoryDeadLetterService } from "./avos-factory-dead-letter.service";
import { AvosFactoryJobQueueService } from "./avos-factory-job-queue.service";
import { AvosFactoryLifecycleService } from "./avos-factory-lifecycle.service";
import { AvosFactoryOperationsController } from "./avos-factory-operations.controller";
import { AvosFactoryOperationsMetricsService } from "./avos-factory-operations-metrics.service";
import { AvosFactoryOperationsSmokeService } from "./avos-factory-operations-smoke.service";
import { AvosFactoryRetryService } from "./avos-factory-retry.service";
import { AvosFactorySchedulerService } from "./avos-factory-scheduler.service";
import { AvosFactoryBlueprintSyncService } from "./avos-factory-blueprint-sync.service";
import { AvosFactoryCapabilityPublisherService } from "./avos-factory-capability-publisher.service";
import { AvosFactoryDNAEvolutionService } from "./avos-factory-dna-evolution.service";
import { AvosFactoryEventBusService } from "./avos-factory-event-bus.service";
import { AvosFactoryKnowledgePublisherService } from "./avos-factory-knowledge-publisher.service";
import { AvosFactorySynchronizationController } from "./avos-factory-synchronization.controller";
import { AvosFactorySynchronizationOrchestratorService } from "./avos-factory-synchronization-orchestrator.service";
import { AvosFactorySynchronizationSmokeService } from "./avos-factory-synchronization-smoke.service";
import { AvosFactoryDigitalDNAService } from "./avos-factory-digital-dna.service";
import { AvosFactoryEnterpriseBridgeService } from "./avos-factory-enterprise-bridge.service";
import { AvosFactoryIntegrationController } from "./avos-factory-integration.controller";
import { AvosFactoryIntegrationDiscoveryService } from "./avos-factory-integration-discovery.service";
import { AvosFactoryIntegrationRegistryService } from "./avos-factory-integration-registry.service";
import { AvosFactoryIntegrationVerificationService } from "./avos-factory-integration-verification.service";
import { AvosFactoryLivingBlueprintService } from "./avos-factory-living-blueprint.service";
import { AvosFactoryArchitectureReviewService } from "./avos-factory-architecture-review.service";
import { AvosFactoryE2EService } from "./avos-factory-e2e.service";
import { AvosFactoryFinalCertificationService } from "./avos-factory-final-certification.service";
import { AvosFactoryFinalReviewController } from "./avos-factory-final-review.controller";
import { AvosFactoryReleaseReadinessService } from "./avos-factory-release-readiness.service";
import { AvosFactoryCertificationEnforcementService } from "./avos-factory-certification-enforcement.service";
import { AvosFactoryEnforcementController } from "./avos-factory-enforcement.controller";
import { AvosFactoryEnforcementMetricsService } from "./avos-factory-enforcement-metrics.service";
import { AvosFactoryEnforcementSmokeService } from "./avos-factory-enforcement-smoke.service";
import { AvosFactoryExecutionEnforcementService } from "./avos-factory-execution-enforcement.service";
import { AvosFactoryRollbackEnforcementService } from "./avos-factory-rollback-enforcement.service";
import { AvosFactoryAuditService } from "./avos-factory-audit.service";
import { AvosFactoryDiagnosticsService } from "./avos-factory-diagnostics.service";
import { AvosFactoryGovernanceService } from "./avos-factory-governance.service";
import { AvosFactoryHealthService } from "./avos-factory-health.service";
import { AvosFactoryIdempotencyService } from "./avos-factory-idempotency.service";
import { AvosFactoryLockService } from "./avos-factory-lock.service";
import { AvosFactoryOperationalController } from "./avos-factory-operational.controller";
import { AvosFactoryReadinessService } from "./avos-factory-readiness.service";
import { AvosFactoryCertificationService } from "./avos-factory-certification.service";
import { AvosFactoryCoreV1Controller } from "./avos-factory-core-v1.controller";
import { AvosFactoryRuntimeService } from "./avos-factory-runtime.service";
import { AvosFactoryVerificationService } from "./avos-factory-verification.service";
import { ProjectExecutionHistoryService } from "./project-execution-history.service";
import { ProjectExecutionService } from "./project-execution.service";
import { ProjectFilesystemTransactionService } from "./project-filesystem-transaction.service";
import { ProjectManifestService } from "./project-manifest.service";
import { ProjectRollbackEngineService } from "./project-rollback-engine.service";
import { ProjectSmokeTestService } from "./project-smoke-test.service";
import { ProjectVerificationService } from "./project-verification.service";
import { BuiltInProjectKindsService } from "./built-in-project-kinds.service";
import { ProjectGenerationPlannerService } from "./project-generation-planner.service";
import { ProjectGeneratorHistoryService } from "./project-generator-history.service";
import { ProjectGeneratorMetricsService } from "./project-generator-metrics.service";
import { ProjectGeneratorPolicyService } from "./project-generator-policy.service";
import { ProjectGeneratorService } from "./project-generator.service";
import { ProjectGeneratorValidationService } from "./project-generator-validation.service";
import { ProjectKindRegistryService } from "./project-kind-registry.service";
import { ProjectStructureFactoryService } from "./project-structure-factory.service";
import { Module } from "@nestjs/common";
import { EnterpriseProductionModule } from "./avos-factory/enterprise-production/enterprise-production.module";
import {
  AiGenerationPlannerService
} from "./ai-generation-planner.service";
import {
  AiGeneratorHistoryService
} from "./ai-generator-history.service";
import {
  AiGeneratorMetricsService
} from "./ai-generator-metrics.service";
import {
  AiGeneratorPolicyService
} from "./ai-generator-policy.service";
import {
  AiGeneratorService
} from "./ai-generator.service";
import {
  AiGeneratorValidationService
} from "./ai-generator-validation.service";
import {
  AiPromptAnalyzerService
} from "./ai-prompt-analyzer.service";
import {
  BlueprintEngineService
} from "./blueprint-engine.service";
import {
  BlueprintHistoryService
} from "./blueprint-history.service";
import {
  BlueprintMetricsService
} from "./blueprint-metrics.service";
import {
  BlueprintParserService
} from "./blueprint-parser.service";
import {
  BlueprintPlannerService
} from "./blueprint-planner.service";
import {
  BlueprintRegistryService
} from "./blueprint-registry.service";
import {
  BlueprintValidationService
} from "./blueprint-validation.service";
import {
  CodeGenerationBootstrapService
} from "./code-generation-bootstrap.service";
import {
  CodeGenerationEngineService
} from "./code-generation-engine.service";
import {
  CodeGenerationProviderRegistryService
} from "./code-generation-provider-registry.service";
import {
  CodeGenerationValidationService
} from "./code-generation-validation.service";
import {
  GenerationHistoryService
} from "./generation-history.service";
import {
  GenerationMetricsService
} from "./generation-metrics.service";
import {
  GenerationOutputManagerService
} from "./generation-output-manager.service";
import {
  TypeScriptCodeGenerationProvider
} from "./typescript-code-generation.provider";
import {
  BuiltInTemplateBootstrapService
} from "./built-in-template-bootstrap.service";
import {
  TemplateCompositionService
} from "./template-composition.service";
import {
  TemplateEngineService
} from "./template-engine.service";
import {
  TemplateHistoryService
} from "./template-history.service";
import {
  TemplateMetricsService
} from "./template-metrics.service";
import {
  TemplateParserService
} from "./template-parser.service";
import {
  TemplateRegistryService
} from "./template-registry.service";
import {
  TemplateRendererService
} from "./template-renderer.service";
import {
  TemplateValidationService
} from "./template-validation.service";

@Module({
  imports: [
    EnterpriseProductionModule,CapabilityProductionModule],
  controllers: [AvosFactoryCoreV1Controller, AvosFactoryOperationalController, AvosFactoryEnforcementController, AvosFactoryFinalReviewController, AvosFactoryIntegrationController, AvosFactorySynchronizationController, AvosFactoryOperationsController, AvosFactoryIntelligenceController, AvosFactoryValidationController, AvosFactorySecurityController, AvosFactoryCertificationIntegrationController,
    AvosFactoryCertificationIntegrationController,
    AvosFactoryDeploymentGovernanceController,
    AvosFactoryReleaseHealthController,
    AvosFactoryReleaseIntelligenceController,
    AvosFactoryCoreCompletionCertificationController,],
  providers: [
    BlueprintRegistryService,
    BlueprintValidationService,
    BlueprintParserService,
    BlueprintPlannerService,
    BlueprintHistoryService,
    BlueprintMetricsService,
    BlueprintEngineService,

    CodeGenerationProviderRegistryService,
    CodeGenerationValidationService,
    GenerationOutputManagerService,
    GenerationHistoryService,
    GenerationMetricsService,
    TypeScriptCodeGenerationProvider,
    CodeGenerationBootstrapService,
    CodeGenerationEngineService,

    TemplateRegistryService,
    TemplateValidationService,
    TemplateParserService,
    TemplateRendererService,
    TemplateCompositionService,
    TemplateHistoryService,
    TemplateMetricsService,
    TemplateEngineService,
    BuiltInTemplateBootstrapService,

    AiGeneratorValidationService,
    AiPromptAnalyzerService,
    AiGeneratorPolicyService,
    AiGenerationPlannerService,
    AiGeneratorHistoryService,
    AiGeneratorMetricsService,
    AiGeneratorService,

    ProjectKindRegistryService,
    ProjectStructureFactoryService,
    ProjectGeneratorValidationService,
    ProjectGeneratorPolicyService,
    ProjectGenerationPlannerService,
    ProjectGeneratorHistoryService,
    ProjectGeneratorMetricsService,
    ProjectGeneratorService,

    ProjectFilesystemTransactionService,
    ProjectManifestService,
    ProjectVerificationService,
    ProjectExecutionHistoryService,
    ProjectExecutionService,
    ProjectRollbackEngineService,
    ProjectSmokeTestService,

    AvosFactoryRuntimeService,
    AvosFactoryVerificationService,
    AvosFactoryCertificationService,

    AvosFactoryGovernanceService,
    AvosFactoryLockService,
    AvosFactoryIdempotencyService,
    AvosFactoryAuditService,
    AvosFactoryHealthService,
    AvosFactoryReadinessService,
    AvosFactoryDiagnosticsService,

    AvosFactoryEnforcementMetricsService,
    AvosFactoryExecutionEnforcementService,
    AvosFactoryRollbackEnforcementService,
    AvosFactoryCertificationEnforcementService,
    AvosFactoryEnforcementSmokeService,

    AvosFactoryArchitectureReviewService,
    AvosFactoryE2EService,
    AvosFactoryReleaseReadinessService,
    AvosFactoryFinalCertificationService,

    AvosFactoryIntegrationDiscoveryService,
    AvosFactoryIntegrationRegistryService,
    AvosFactoryLivingBlueprintService,
    AvosFactoryDigitalDNAService,
    AvosFactoryEnterpriseBridgeService,
    AvosFactoryIntegrationVerificationService,

    AvosFactoryEventBusService,
    AvosFactoryCapabilityPublisherService,
    AvosFactoryKnowledgePublisherService,
    AvosFactoryBlueprintSyncService,
    AvosFactoryDNAEvolutionService,
    AvosFactorySynchronizationOrchestratorService,
    AvosFactorySynchronizationSmokeService,

    AvosFactoryLifecycleService,
    AvosFactoryJobQueueService,
    AvosFactoryDeadLetterService,
    AvosFactoryRetryService,
    AvosFactorySchedulerService,
    AvosFactoryOperationsMetricsService,
    AvosFactoryOperationsSmokeService,

    AvosFactoryQualityScoringService,
    AvosFactoryGenerationAnalyzerService,
    AvosFactoryRecommendationEngineService,
    AvosFactoryTemplateIntelligenceService,
    AvosFactoryBlueprintIntelligenceService,
    AvosFactoryCapabilityIntelligenceService,
    AvosFactoryLearningMemoryService,
    AvosFactoryEnterpriseInsightsService,
    AvosFactoryIntelligenceSmokeService,

    AvosFactoryValidationRuleRegistryService,
    AvosFactoryValidationEngineService,
    AvosFactoryQualityGateService,
    AvosFactoryDefectRegistryService,
    AvosFactoryComplianceReportingService,
    AvosFactoryValidationSmokeService,

    AvosFactorySecurityPolicyRegistryService,
    AvosFactoryPolicyEvaluationService,
    AvosFactorySecurityAssessmentService,
    AvosFactoryPolicyExceptionService,
    AvosFactorySecuritySmokeService,

    ProjectKindRegistryService,
    ProjectStructureFactoryService,
    BuiltInProjectKindsService,
    ProjectGeneratorValidationService,
    ProjectGeneratorPolicyService,
    ProjectGenerationPlannerService,
    ProjectGeneratorHistoryService,
    ProjectGeneratorMetricsService,
    ProjectGeneratorService,

    ProjectFilesystemTransactionService,
    ProjectManifestService,
    ProjectVerificationService,
    ProjectExecutionHistoryService,
    ProjectExecutionService,
    ProjectRollbackEngineService,
    ProjectSmokeTestService,

    AvosFactoryRuntimeService,
    AvosFactoryVerificationService,
    AvosFactoryCertificationService,

    AvosFactoryGovernanceService,
    AvosFactoryLockService,
    AvosFactoryIdempotencyService,
    AvosFactoryAuditService,
    AvosFactoryHealthService,
    AvosFactoryReadinessService,
    AvosFactoryDiagnosticsService,

    AvosFactoryEnforcementMetricsService,
    AvosFactoryExecutionEnforcementService,
    AvosFactoryRollbackEnforcementService,
    AvosFactoryCertificationEnforcementService,
    AvosFactoryEnforcementSmokeService,

    AvosFactoryArchitectureReviewService,
    AvosFactoryE2EService,
    AvosFactoryReleaseReadinessService,
    AvosFactoryFinalCertificationService,

    AvosFactoryIntegrationDiscoveryService,
    AvosFactoryIntegrationRegistryService,
    AvosFactoryLivingBlueprintService,
    AvosFactoryDigitalDNAService,
    AvosFactoryEnterpriseBridgeService,
    AvosFactoryIntegrationVerificationService,

    AvosFactoryEventBusService,
    AvosFactoryCapabilityPublisherService,
    AvosFactoryKnowledgePublisherService,
    AvosFactoryBlueprintSyncService,
    AvosFactoryDNAEvolutionService,
    AvosFactorySynchronizationOrchestratorService,
    AvosFactorySynchronizationSmokeService,

    AvosFactoryLifecycleService,
    AvosFactoryJobQueueService,
    AvosFactoryDeadLetterService,
    AvosFactoryRetryService,
    AvosFactorySchedulerService,
    AvosFactoryOperationsMetricsService,
    AvosFactoryOperationsSmokeService,

    AvosFactoryQualityScoringService,
    AvosFactoryGenerationAnalyzerService,
    AvosFactoryRecommendationEngineService,
    AvosFactoryTemplateIntelligenceService,
    AvosFactoryBlueprintIntelligenceService,
    AvosFactoryCapabilityIntelligenceService,
    AvosFactoryLearningMemoryService,
    AvosFactoryEnterpriseInsightsService,
    AvosFactoryIntelligenceSmokeService,

    AvosFactoryValidationRuleRegistryService,
    AvosFactoryValidationEngineService,
    AvosFactoryQualityGateService,
    AvosFactoryDefectRegistryService,
    AvosFactoryComplianceReportingService,
    AvosFactoryValidationSmokeService,

    AvosFactorySecurityPolicyRegistryService,
    AvosFactoryPolicyEvaluationService,
    AvosFactorySecurityAssessmentService,
    AvosFactoryPolicyExceptionService,
    AvosFactorySecuritySmokeService,
    AvosFactoryCertificationCriteriaRegistryService,
    AvosFactoryCertificationAssessmentService,
    AvosFactoryCertificateRegistryService,
    AvosFactoryReleaseGovernanceService,
    AvosFactoryCertificationIntegrationSmokeService,
    AvosFactoryPromotionPolicyRegistryService,
    AvosFactoryDeploymentPlanService,
    AvosFactoryPromotionApprovalService,
    AvosFactoryDeploymentExecutionService,
    AvosFactoryDeploymentSmokeService,
    AvosFactoryReleaseHealthService,
    AvosFactoryPostDeploymentVerificationService,
    AvosFactoryRecoveryGovernanceService,
    AvosFactoryReleaseHealthSmokeService,
    AvosFactoryDeploymentLearningService,
    AvosFactoryReleaseIntelligenceService,
    AvosFactoryContinuousImprovementService,
    AvosFactoryReleaseLearningMemoryService,
    AvosFactoryReleaseIntelligenceSmokeService,
    AvosFactoryCoreCompletionValidationService,
    AvosFactoryCoreCompletionCertificationService,
    AvosFactoryCoreCompletionHealthService,
    AvosFactoryCoreCompletionSmokeService,],
  exports: [
    BlueprintRegistryService,
    BlueprintValidationService,
    BlueprintParserService,
    BlueprintPlannerService,
    BlueprintHistoryService,
    BlueprintMetricsService,
    BlueprintEngineService,

    CodeGenerationProviderRegistryService,
    CodeGenerationValidationService,
    GenerationOutputManagerService,
    GenerationHistoryService,
    GenerationMetricsService,
    TypeScriptCodeGenerationProvider,
    CodeGenerationEngineService,

    TemplateRegistryService,
    TemplateValidationService,
    TemplateParserService,
    TemplateRendererService,
    TemplateCompositionService,
    TemplateHistoryService,
    TemplateMetricsService,
    TemplateEngineService
  ]
})
export class AvosFactoryCoreV1Module {}






















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
  controllers: [AvosFactoryCoreV1Controller, AvosFactoryOperationalController, AvosFactoryEnforcementController, AvosFactoryFinalReviewController, AvosFactoryIntegrationController, AvosFactorySynchronizationController],
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
    AvosFactorySynchronizationSmokeService
  ],
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










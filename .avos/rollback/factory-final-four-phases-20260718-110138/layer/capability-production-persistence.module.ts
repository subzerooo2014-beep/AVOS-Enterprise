import { ProductFactoryController } from "./product-factory.controller";
import { ProductFactoryOrchestratorService } from "./product-factory-orchestrator.service";
import { ProductLaunchReadinessService } from "./product-launch-readiness.service";
import { ProductQualityCertificationService } from "./product-quality-certification.service";
import { ProductGenesisIntegrationService } from "./product-genesis-integration.service";
import { ProductKnowledgeRegistrationService } from "./product-knowledge-registration.service";
import { ProductDigitalDnaService } from "./product-digital-dna.service";
import { ProductSecurityGovernanceService } from "./product-security-governance.service";
import { ProductDataContractEngineService } from "./product-data-contract-engine.service";
import { ProductExperienceComposerService } from "./product-experience-composer.service";
import { ProductCapabilityAssemblerService } from "./product-capability-assembler.service";
import { ProductArchitectureComposerService } from "./product-architecture-composer.service";
import { ProductBlueprintCompilerService } from "./product-blueprint-compiler.service";
import { FactoryEvolutionController } from "./factory-evolution.controller";
import { FactoryEvolutionOrchestratorService } from "./factory-evolution-orchestrator.service";
import { HumanApprovalGateService } from "./human-approval-gate.service";
import { RollbackStrategyEngineService } from "./rollback-strategy-engine.service";
import { DeploymentReadinessEngineService } from "./deployment-readiness-engine.service";
import { ReleaseManifestEngineService } from "./release-manifest-engine.service";
import { DocumentationComposerService } from "./documentation-composer.service";
import { TestStrategyPlannerService } from "./test-strategy-planner.service";
import { QualityGateEngineService } from "./quality-gate-engine.service";
import { DependencyPlanEngineService } from "./dependency-plan-engine.service";
import { ArchitectureValidationEngineService } from "./architecture-validation-engine.service";
import { ProductionPolicyEngineService } from "./production-policy-engine.service";
import { PipelineTemplateRegistryService } from "./pipeline-template-registry.service";
import { BlueprintCompilerService } from "./blueprint-compiler.service";
import { CapabilityProductionFinalOrchestratorService } from "./capability-production-final-orchestrator.service";
import { CapabilityProductionFinalOrchestratorController } from "./capability-production-final-orchestrator.controller";
import { FailureSuggestedFixGeneratorService } from "./failure-suggested-fix-generator.service";
import { FailureStackTraceAnalyzerService } from "./failure-stack-trace-analyzer.service";
import { FailureRootCauseAnalyzerService } from "./failure-root-cause-analyzer.service";
import { FailureRecoveryPlannerService } from "./failure-recovery-planner.service";
import { FailureDiagnosisEngineService } from "./failure-diagnosis-engine.service";
import { FailureDiagnosisController } from "./failure-diagnosis.controller";
import { FailureDependencyAnalyzerService } from "./failure-dependency-analyzer.service";
import { FailureClassificationService } from "./failure-classification.service";
import { RuntimeSmokeExecutorService } from "./runtime-smoke-executor.service";
import { RuntimeSmokeExecutorController } from "./runtime-smoke-executor.controller";
import { CapabilityValidationGeneratorService } from "./capability-validation-generator.service";
import { CapabilityUnitTestGeneratorService } from "./capability-unit-test-generator.service";
import { CapabilityProductionMegaBundleCService } from "./capability-production-mega-bundle-c.service";
import { CapabilityProductionMegaBundleCController } from "./capability-production-mega-bundle-c.controller";
import { CapabilityIntegrationTestGeneratorService } from "./capability-integration-test-generator.service";
import { CapabilityDtoGeneratorService } from "./capability-dto-generator.service";
import { CapabilityControllerGeneratorService } from "./capability-controller-generator.service";
import { CapabilityBuildExecutionEngineService } from "./capability-build-execution-engine.service";
import { PhysicalFileWriterService } from "./physical-file-writer.service";
import { NestjsModuleComposerService } from "./nestjs-module-composer.service";
import { CapabilityWorkspaceBuilderService } from "./capability-workspace-builder.service";
import { CapabilityProductionBundleBService } from "./capability-production-bundle-b.service";
import { CapabilityProductionBundleBController } from "./capability-production-bundle-b.controller";
import { Module } from "@nestjs/common";
import { CapabilityArtifactRepositoryService } from "./capability-artifact-repository.service";
import { CapabilityProductionPathsService } from "./capability-production-paths.service";
import { CapabilityProductionPersistenceController } from "./capability-production-persistence.controller";
import { GeneratedSourceMaterializerService } from "./generated-source-materializer.service";
import { PersistentProductionRegistryService } from "./persistent-production-registry.service";

@Module({
  controllers: [ProductFactoryController, FactoryEvolutionController, CapabilityProductionFinalOrchestratorController, FailureDiagnosisController, RuntimeSmokeExecutorController, CapabilityProductionMegaBundleCController, CapabilityProductionBundleBController, CapabilityProductionPersistenceController],
  providers: [ProductFactoryOrchestratorService, ProductLaunchReadinessService, ProductQualityCertificationService, ProductGenesisIntegrationService, ProductKnowledgeRegistrationService, ProductDigitalDnaService, ProductSecurityGovernanceService, ProductDataContractEngineService, ProductExperienceComposerService, ProductCapabilityAssemblerService, ProductArchitectureComposerService, ProductBlueprintCompilerService, FactoryEvolutionOrchestratorService, HumanApprovalGateService, RollbackStrategyEngineService, DeploymentReadinessEngineService, ReleaseManifestEngineService, DocumentationComposerService, TestStrategyPlannerService, QualityGateEngineService, DependencyPlanEngineService, ArchitectureValidationEngineService, ProductionPolicyEngineService, PipelineTemplateRegistryService, BlueprintCompilerService, CapabilityProductionFinalOrchestratorService, FailureSuggestedFixGeneratorService, FailureStackTraceAnalyzerService, FailureRootCauseAnalyzerService, FailureRecoveryPlannerService, FailureDiagnosisEngineService, FailureDependencyAnalyzerService, FailureClassificationService, RuntimeSmokeExecutorService, CapabilityProductionMegaBundleCService, CapabilityBuildExecutionEngineService, CapabilityIntegrationTestGeneratorService, CapabilityUnitTestGeneratorService, CapabilityValidationGeneratorService, CapabilityDtoGeneratorService, CapabilityControllerGeneratorService, CapabilityProductionBundleBService, NestjsModuleComposerService, CapabilityWorkspaceBuilderService, PhysicalFileWriterService, 
    CapabilityProductionPathsService,
    PersistentProductionRegistryService,
    CapabilityArtifactRepositoryService,
    GeneratedSourceMaterializerService],
  exports: [ProductFactoryOrchestratorService, ProductLaunchReadinessService, ProductQualityCertificationService, ProductGenesisIntegrationService, ProductKnowledgeRegistrationService, ProductDigitalDnaService, ProductSecurityGovernanceService, ProductDataContractEngineService, ProductExperienceComposerService, ProductCapabilityAssemblerService, ProductArchitectureComposerService, ProductBlueprintCompilerService, FactoryEvolutionOrchestratorService, HumanApprovalGateService, RollbackStrategyEngineService, DeploymentReadinessEngineService, ReleaseManifestEngineService, DocumentationComposerService, TestStrategyPlannerService, QualityGateEngineService, DependencyPlanEngineService, ArchitectureValidationEngineService, ProductionPolicyEngineService, PipelineTemplateRegistryService, BlueprintCompilerService, CapabilityProductionFinalOrchestratorService, FailureSuggestedFixGeneratorService, FailureStackTraceAnalyzerService, FailureRootCauseAnalyzerService, FailureRecoveryPlannerService, FailureDiagnosisEngineService, FailureDependencyAnalyzerService, FailureClassificationService, RuntimeSmokeExecutorService, CapabilityProductionMegaBundleCService, CapabilityBuildExecutionEngineService, CapabilityIntegrationTestGeneratorService, CapabilityUnitTestGeneratorService, CapabilityValidationGeneratorService, CapabilityDtoGeneratorService, CapabilityControllerGeneratorService, CapabilityProductionBundleBService, NestjsModuleComposerService, CapabilityWorkspaceBuilderService, PhysicalFileWriterService, 
    PersistentProductionRegistryService,
    CapabilityArtifactRepositoryService,
    GeneratedSourceMaterializerService]
})
export class CapabilityProductionPersistenceModule {}









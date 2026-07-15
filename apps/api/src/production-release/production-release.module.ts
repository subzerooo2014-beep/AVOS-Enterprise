import { Module } from '@nestjs/common';
import { ProductionReleaseController } from './production-release.controller';
import { ReleaseManifestEngineService } from './release-manifest-engine.service';
import { ReleaseNotesEngineService } from './release-notes-engine.service';
import { ReleaseArtifactRegistryService } from './release-artifact-registry.service';
import { FinalBuildValidationEngineService } from './final-build-validation-engine.service';
import { FinalSmokeValidationEngineService } from './final-smoke-validation-engine.service';
import { FinalIntegrationValidationEngineService } from './final-integration-validation-engine.service';
import { FinalVerificationEngineService } from './final-verification-engine.service';
import { ProductionCertificateRegistryService } from './production-certificate-registry.service';
import { ReleaseTagReadinessEngineService } from './release-tag-readiness-engine.service';
import { RollbackManifestEngineService } from './rollback-manifest-engine.service';
import { DeploymentManifestEngineService } from './deployment-manifest-engine.service';
import { ReleaseGovernanceEngineService } from './release-governance-engine.service';
import { ProductionReleaseOrchestratorService } from './production-release-orchestrator.service';
import { ProductionReleaseDashboardService } from './production-release-dashboard.service';

@Module({
  controllers: [ProductionReleaseController],
  providers: [
    ReleaseManifestEngineService,
    ReleaseNotesEngineService,
    ReleaseArtifactRegistryService,
    FinalBuildValidationEngineService,
    FinalSmokeValidationEngineService,
    FinalIntegrationValidationEngineService,
    FinalVerificationEngineService,
    ProductionCertificateRegistryService,
    ReleaseTagReadinessEngineService,
    RollbackManifestEngineService,
    DeploymentManifestEngineService,
    ReleaseGovernanceEngineService,
    ProductionReleaseOrchestratorService,
    ProductionReleaseDashboardService,
  ],
  exports: [
    ReleaseManifestEngineService,
    ReleaseNotesEngineService,
    ReleaseArtifactRegistryService,
    FinalBuildValidationEngineService,
    FinalSmokeValidationEngineService,
    FinalIntegrationValidationEngineService,
    FinalVerificationEngineService,
    ProductionCertificateRegistryService,
    ReleaseTagReadinessEngineService,
    RollbackManifestEngineService,
    DeploymentManifestEngineService,
    ReleaseGovernanceEngineService,
    ProductionReleaseOrchestratorService,
    ProductionReleaseDashboardService,
  ],
})
export class ProductionReleaseModule {}
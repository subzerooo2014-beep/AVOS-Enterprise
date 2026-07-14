import { Module } from '@nestjs/common';
import { FoundationProductionReadinessController } from './foundation-production-readiness.controller';
import { FoundationIntegrityEngineService } from './foundation-integrity-engine.service';
import { ArchitectureConformanceEngineService } from './architecture-conformance-engine.service';
import { ModuleConnectivityVerifierService } from './module-connectivity-verifier.service';
import { ProductionReadinessAssessorService } from './production-readiness-assessor.service';
import { SecurityReadinessAuditorService } from './security-readiness-auditor.service';
import { DataReadinessAuditorService } from './data-readiness-auditor.service';
import { OperationalReadinessAuditorService } from './operational-readiness-auditor.service';
import { DependencyHealthAnalyzerService } from './dependency-health-analyzer.service';
import { ReleaseGateOrchestratorService } from './release-gate-orchestrator.service';
import { EndToEndFoundationValidatorService } from './end-to-end-foundation-validator.service';
import { FoundationEvidenceRegistryService } from './foundation-evidence-registry.service';
import { ProductionReadinessDashboardService } from './production-readiness-dashboard.service';
import { FoundationCompletionCertificateService } from './foundation-completion-certificate.service';
import { FoundationProductionReadinessOrchestratorService } from './foundation-production-readiness-orchestrator.service';

@Module({
  controllers: [FoundationProductionReadinessController],
  providers: [
    FoundationIntegrityEngineService,
    ArchitectureConformanceEngineService,
    ModuleConnectivityVerifierService,
    ProductionReadinessAssessorService,
    SecurityReadinessAuditorService,
    DataReadinessAuditorService,
    OperationalReadinessAuditorService,
    DependencyHealthAnalyzerService,
    ReleaseGateOrchestratorService,
    EndToEndFoundationValidatorService,
    FoundationEvidenceRegistryService,
    ProductionReadinessDashboardService,
    FoundationCompletionCertificateService,
    FoundationProductionReadinessOrchestratorService,
  ],
  exports: [
    FoundationIntegrityEngineService,
    ArchitectureConformanceEngineService,
    ModuleConnectivityVerifierService,
    ProductionReadinessAssessorService,
    SecurityReadinessAuditorService,
    DataReadinessAuditorService,
    OperationalReadinessAuditorService,
    DependencyHealthAnalyzerService,
    ReleaseGateOrchestratorService,
    EndToEndFoundationValidatorService,
    FoundationEvidenceRegistryService,
    ProductionReadinessDashboardService,
    FoundationCompletionCertificateService,
    FoundationProductionReadinessOrchestratorService,
  ],
})
export class FoundationProductionReadinessModule {}
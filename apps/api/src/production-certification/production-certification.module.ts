import { Module } from '@nestjs/common';
import { ProductionCertificationController } from './production-certification.controller';
import { SecurityCertificationEngineService } from './security-certification-engine.service';
import { PerformanceCertificationEngineService } from './performance-certification-engine.service';
import { ComplianceCertificationEngineService } from './compliance-certification-engine.service';
import { LoadTestCertificationEngineService } from './load-test-certification-engine.service';
import { PenetrationReadinessEngineService } from './penetration-readiness-engine.service';
import { DataProtectionCertificationEngineService } from './data-protection-certification-engine.service';
import { BusinessContinuityCertificationEngineService } from './business-continuity-certification-engine.service';
import { ReleaseCandidateEngineService } from './release-candidate-engine.service';
import { QualitySignoffEngineService } from './quality-signoff-engine.service';
import { OperationsSignoffEngineService } from './operations-signoff-engine.service';
import { SecuritySignoffEngineService } from './security-signoff-engine.service';
import { ExecutiveApprovalEngineService } from './executive-approval-engine.service';
import { ReleaseEvidenceRegistryService } from './release-evidence-registry.service';
import { ProductionCertificateEngineService } from './production-certificate-engine.service';
import { CertificationOrchestratorService } from './certification-orchestrator.service';
import { ProductionCertificationDashboardService } from './production-certification-dashboard.service';

@Module({
  controllers: [ProductionCertificationController],
  providers: [
    SecurityCertificationEngineService,
    PerformanceCertificationEngineService,
    ComplianceCertificationEngineService,
    LoadTestCertificationEngineService,
    PenetrationReadinessEngineService,
    DataProtectionCertificationEngineService,
    BusinessContinuityCertificationEngineService,
    ReleaseCandidateEngineService,
    QualitySignoffEngineService,
    OperationsSignoffEngineService,
    SecuritySignoffEngineService,
    ExecutiveApprovalEngineService,
    ReleaseEvidenceRegistryService,
    ProductionCertificateEngineService,
    CertificationOrchestratorService,
    ProductionCertificationDashboardService,
  ],
  exports: [
    SecurityCertificationEngineService,
    PerformanceCertificationEngineService,
    ComplianceCertificationEngineService,
    LoadTestCertificationEngineService,
    PenetrationReadinessEngineService,
    DataProtectionCertificationEngineService,
    BusinessContinuityCertificationEngineService,
    ReleaseCandidateEngineService,
    QualitySignoffEngineService,
    OperationsSignoffEngineService,
    SecuritySignoffEngineService,
    ExecutiveApprovalEngineService,
    ReleaseEvidenceRegistryService,
    ProductionCertificateEngineService,
    CertificationOrchestratorService,
    ProductionCertificationDashboardService,
  ],
})
export class ProductionCertificationModule {}
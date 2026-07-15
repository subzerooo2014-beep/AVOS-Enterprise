import { Injectable } from '@nestjs/common';
import {
  CertificationControl,
  ComplianceRequirement,
  LoadTestResult,
  SignoffRecord,
} from './production-certification.types';
import { SecurityCertificationEngineService } from './security-certification-engine.service';
import { PerformanceCertificationEngineService } from './performance-certification-engine.service';
import { ComplianceCertificationEngineService } from './compliance-certification-engine.service';
import { ExecutiveApprovalEngineService } from './executive-approval-engine.service';
import { ReleaseCandidateEngineService } from './release-candidate-engine.service';
import { ProductionCertificateEngineService } from './production-certificate-engine.service';

@Injectable()
export class CertificationOrchestratorService {
  constructor(
    private readonly security: SecurityCertificationEngineService,
    private readonly performance: PerformanceCertificationEngineService,
    private readonly compliance: ComplianceCertificationEngineService,
    private readonly approvals: ExecutiveApprovalEngineService,
    private readonly releaseCandidates: ReleaseCandidateEngineService,
    private readonly certificates: ProductionCertificateEngineService,
  ) {}

  run(input: {
    version: string;
    commitSha: string;
    securityControls: CertificationControl[];
    loadTests: LoadTestResult[];
    complianceRequirements: ComplianceRequirement[];
    signoffs: SignoffRecord[];
  }) {
    const security = this.security.certify(input.securityControls);
    const performance = this.performance.certify(input.loadTests);
    const compliance = this.compliance.certify(
      input.complianceRequirements,
    );
    const approvals = this.approvals.evaluate(input.signoffs);

    const releaseCandidate = this.releaseCandidates.evaluate({
      id: `rc-${input.version}`,
      version: input.version,
      commitSha: input.commitSha,
      buildPassed: true,
      testsPassed: true,
      securityPassed: security.certified,
      performancePassed: performance.certified,
      compliancePassed: compliance.certified,
    });

    const score = Math.round(
      security.score * 0.3 +
        performance.score * 0.25 +
        compliance.score * 0.2 +
        approvals.score * 0.25,
    );

    const certificate = this.certificates.issue({
      releaseCandidate,
      score,
      approvals: approvals.approvedRoles,
      evidence: [
        ...input.securityControls.flatMap((control) => control.evidence),
        ...input.complianceRequirements.flatMap(
          (requirement) => requirement.evidence,
        ),
      ],
    });

    return {
      security,
      performance,
      compliance,
      approvals,
      releaseCandidate,
      certificate,
    };
  }
}
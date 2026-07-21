import { Injectable } from '@nestjs/common';
import { SoftwareDevelopmentRun } from './avos-software-development-os.types';

@Injectable()
export class VerificationCertificationService {
  verify(run: SoftwareDevelopmentRun) {
    const checks = {
      blueprintExists: Boolean(run.blueprint.id),
      workforcePlanExists: run.workItems.length > 0,
      architectureGateDefined:
        run.blueprint.qualityGates.includes('architecture-compliance'),
      securityGateDefined: run.blueprint.qualityGates.includes('security-review'),
      humanAuthorityDefined:
        run.blueprint.qualityGates.includes('human-final-authority'),
      globalComplianceReady:
        run.blueprint.complianceRequirements.includes('jurisdiction-awareness'),
      auditability:
        run.blueprint.complianceRequirements.includes('auditability'),
    };

    const passed = Object.values(checks).filter(Boolean).length;
    const total = Object.keys(checks).length;

    return {
      checks,
      score: Math.round((passed / total) * 100),
      passed: passed === total,
      verifiedAt: new Date().toISOString(),
    };
  }

  certify(run: SoftwareDevelopmentRun, approvedBy: string) {
    const verification = this.verify(run);
    if (!verification.passed) {
      throw new Error('Software Development OS run failed verification.');
    }

    return {
      certificationId: `sdos-cert-${Date.now()}`,
      status: 'certified',
      score: verification.score,
      approvedBy,
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
      certifiedAt: new Date().toISOString(),
    };
  }
}
import { Injectable } from '@nestjs/common';
import { UnifiedCertificationContribution } from '../domain/apcp-production-capability.types';
import { ApcpProductionCapabilityService } from './apcp-production-capability.service';

@Injectable()
export class ApcpUnifiedCertificationIntegrationService {
  constructor(
    private readonly capability: ApcpProductionCapabilityService,
  ) {}

  contribution(): UnifiedCertificationContribution {
    const { registration, certification } = this.capability.status();

    const blockingIssues: string[] = [];
    if (registration.status !== 'operational') {
      blockingIssues.push('capability-not-operational');
    }
    if (certification.verifiedDomains !== certification.expectedDomains) {
      blockingIssues.push('evidence-domains-incomplete');
    }
    if (certification.score !== 100) {
      blockingIssues.push('score-below-100');
    }
    if (certification.risk !== 0) {
      blockingIssues.push('non-zero-risk');
    }
    if (!certification.deploymentAllowed) {
      blockingIssues.push('deployment-gate-blocked');
    }
    if (!certification.digitalTwinReady) {
      blockingIssues.push('digital-twin-not-ready');
    }

    return {
      source: ApcpProductionCapabilityService.CAPABILITY_ID,
      score: certification.score,
      certified:
        certification.state === 'certified' &&
        blockingIssues.length === 0,
      blockingIssues,
      humanApprovalRequired: registration.humanFinalAuthority,
      globalComplianceReady:
        registration.globalComplianceReadinessGate,
    };
  }
}
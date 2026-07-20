import { Injectable } from '@nestjs/common';
import { FactoryCapabilityDescriptor } from '../domain/apcp-production-capability.types';
import { ApcpProductionCapabilityService } from './apcp-production-capability.service';

@Injectable()
export class ApcpFactoryIntegrationService {
  constructor(
    private readonly capability: ApcpProductionCapabilityService,
  ) {}

  descriptor(): FactoryCapabilityDescriptor {
    return {
      capabilityId: ApcpProductionCapabilityService.CAPABILITY_ID,
      accepts: [
        'release-registration',
        'production-evidence',
        'risk-assessment-request',
        'certification-request',
        'deployment-gate-request',
      ],
      produces: [
        'certification-snapshot',
        'deployment-decision',
        'production-passport',
        'digital-twin-result',
        'audit-evidence',
      ],
      orchestrationMode: 'adapter',
      requiresHumanApproval: true,
    };
  }

  executeProductionReadiness(input?: {
    score?: number;
    risk?: number;
    approvedBy?: string;
  }): {
    accepted: boolean;
    humanFinalAuthority: boolean;
    descriptor: FactoryCapabilityDescriptor;
    status: ReturnType<ApcpProductionCapabilityService['status']>;
  } {
    const score = input?.score ?? 100;
    const risk = input?.risk ?? 0;
    const approvedBy = input?.approvedBy?.trim();

    const accepted = score === 100 && risk === 0 && Boolean(approvedBy);

    if (accepted) {
      this.capability.recordCertification({
        score,
        risk,
        state: 'certified',
        deploymentAllowed: true,
        digitalTwinReady: true,
      });
    }

    return {
      accepted,
      humanFinalAuthority: true,
      descriptor: this.descriptor(),
      status: this.capability.status(),
    };
  }
}
import { BadRequestException, Injectable } from '@nestjs/common';
import { DeploymentRequest, GovernanceEnvelope } from './product-factory-enterprise.types';

@Injectable()
export class DeploymentGateService {
  validate(request: DeploymentRequest): GovernanceEnvelope {
    if (!request.namespace?.trim()) {
      throw new BadRequestException('namespace is required.');
    }
    if (!request.version?.trim()) {
      throw new BadRequestException('version is required.');
    }
    if (!request.packagePath?.trim()) {
      throw new BadRequestException('packagePath is required.');
    }
    if (!request.approvedBy?.startsWith('human:')) {
      throw new BadRequestException('Human Final Authority approval is required.');
    }
    if (!request.jurisdiction?.trim()) {
      throw new BadRequestException('jurisdiction is required.');
    }

    return {
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
      approvedBy: request.approvedBy,
      jurisdiction: request.jurisdiction,
    };
  }
}
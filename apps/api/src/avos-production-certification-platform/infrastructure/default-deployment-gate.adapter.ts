import { Injectable } from '@nestjs/common';
import { CertificationRecord } from '../domain/certification.types';
import { DeploymentGatePort } from '../ports/deployment-gate.port';

@Injectable()
export class DefaultDeploymentGateAdapter implements DeploymentGatePort {
  async evaluate(record: CertificationRecord): Promise<{ allowed: boolean; reasons: string[] }> {
    const reasons: string[] = [];

    if (record.state !== 'certified') {
      reasons.push('Certification state is not certified.');
    }

    if (record.score < 100) {
      reasons.push('Certification score is below 100.');
    }

    if (!record.approvedBy) {
      reasons.push('Human final approval is missing.');
    }

    return {
      allowed: reasons.length === 0,
      reasons,
    };
  }
}

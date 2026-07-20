import { Inject, Injectable } from '@nestjs/common';
import { DEPLOYMENT_GATE, EVIDENCE_REPOSITORY } from '../tokens';
import { DeploymentGatePort } from '../ports/deployment-gate.port';
import { EvidenceRepositoryPort } from '../ports/evidence-repository.port';

@Injectable()
export class DeploymentGateService {
  constructor(
    @Inject(EVIDENCE_REPOSITORY)
    private readonly repository: EvidenceRepositoryPort,
    @Inject(DEPLOYMENT_GATE)
    private readonly gate: DeploymentGatePort,
  ) {}

  async evaluate(platformId: string): Promise<{
    platformId: string;
    allowed: boolean;
    reasons: string[];
  }> {
    const record = await this.repository.getLatestCertification(platformId);

    if (!record) {
      return {
        platformId,
        allowed: false,
        reasons: ['No certification record exists.'],
      };
    }

    const result = await this.gate.evaluate(record);
    return {
      platformId,
      ...result,
    };
  }
}

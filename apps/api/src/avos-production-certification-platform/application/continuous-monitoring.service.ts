import { Inject, Injectable } from '@nestjs/common';
import { EVIDENCE_REPOSITORY } from '../tokens';
import { EvidenceRepositoryPort } from '../ports/evidence-repository.port';
import { EvidenceValidationService } from './evidence-validation.service';

@Injectable()
export class ContinuousMonitoringService {
  constructor(
    @Inject(EVIDENCE_REPOSITORY)
    private readonly repository: EvidenceRepositoryPort,
    private readonly validator: EvidenceValidationService,
  ) {}

  async inspect(platformId: string): Promise<{
    platformId: string;
    healthy: boolean;
    certificationState: string;
    score: number;
    reasons: string[];
    inspectedAt: string;
  }> {
    const evidence = await this.repository.getEvidence(platformId);
    const validation = this.validator.validate(evidence);
    const certification = await this.repository.getLatestCertification(platformId);

    return {
      platformId,
      healthy: validation.valid && certification?.state === 'certified',
      certificationState: certification?.state ?? 'missing',
      score: validation.score,
      reasons: validation.reasons,
      inspectedAt: new Date().toISOString(),
    };
  }
}

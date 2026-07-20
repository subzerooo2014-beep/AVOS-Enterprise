import { Inject, Injectable } from '@nestjs/common';
import { CertificationRecord } from '../domain/certification.types';
import { HumanApprovalRequiredError, PlatformValidationError } from '../domain/platform.errors';
import { EVIDENCE_REPOSITORY } from '../tokens';
import { EvidenceRepositoryPort } from '../ports/evidence-repository.port';
import { EvidenceValidationService } from './evidence-validation.service';
import { ManifestEngineService } from './manifest-engine.service';

@Injectable()
export class CertificationEngineService {
  constructor(
    @Inject(EVIDENCE_REPOSITORY)
    private readonly repository: EvidenceRepositoryPort,
    private readonly validator: EvidenceValidationService,
    private readonly manifestEngine: ManifestEngineService,
  ) {}

  async evaluate(platformId: string, version: string): Promise<CertificationRecord> {
    const manifest = await this.manifestEngine.create(platformId, version);
    const validation = this.validator.validate(manifest.evidence);

    const record: CertificationRecord = {
      id: 'certification-' + platformId + '-' + Date.now().toString(),
      platformId,
      manifestId: manifest.id,
      state: validation.valid ? 'ready-for-human-approval' : 'blocked',
      score: validation.score,
      verifiedDomains: validation.verifiedDomains,
      totalDomains: validation.totalDomains,
      reasons: validation.reasons,
    };

    await this.repository.saveCertification(record);
    return record;
  }

  async approve(platformId: string, approvedBy: string): Promise<CertificationRecord> {
    const current = await this.repository.getLatestCertification(platformId);

    if (!current) {
      throw new PlatformValidationError('No certification evaluation exists for platform.');
    }

    if (current.state !== 'ready-for-human-approval') {
      throw new PlatformValidationError('Certification is not ready for human approval.');
    }

    if (!approvedBy.startsWith('human:')) {
      throw new HumanApprovalRequiredError('approvedBy must identify a human authority.');
    }

    const issuedAt = new Date();
    const approved: CertificationRecord = {
      ...current,
      state: 'certified',
      approvedBy,
      approvedAt: issuedAt.toISOString(),
      issuedAt: issuedAt.toISOString(),
      expiresAt: new Date(issuedAt.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    await this.repository.saveCertification(approved);
    return approved;
  }

  async latest(platformId: string): Promise<CertificationRecord | undefined> {
    return this.repository.getLatestCertification(platformId);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { EvidenceManifest } from '../domain/certification.types';
import { EVIDENCE_REPOSITORY } from '../tokens';
import { EvidenceRepositoryPort } from '../ports/evidence-repository.port';

@Injectable()
export class ManifestEngineService {
  constructor(
    @Inject(EVIDENCE_REPOSITORY)
    private readonly repository: EvidenceRepositoryPort,
  ) {}

  async create(platformId: string, version: string): Promise<EvidenceManifest> {
    const evidence = await this.repository.getEvidence(platformId);
    const createdAt = new Date().toISOString();
    const payload = JSON.stringify({ platformId, version, createdAt, evidence });
    const checksum = createHash('sha256').update(payload).digest('hex');

    const manifest: EvidenceManifest = {
      id: 'manifest-' + platformId + '-' + Date.now().toString(),
      platformId,
      version,
      createdAt,
      evidence,
      checksum,
    };

    await this.repository.saveManifest(manifest);
    return manifest;
  }
}

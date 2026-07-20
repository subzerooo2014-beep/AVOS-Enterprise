import { Inject, Injectable } from '@nestjs/common';
import { REQUIRED_EVIDENCE_DOMAINS } from '../domain/platform.constants';
import { EvidenceDomain, ProductionEvidence } from '../domain/certification.types';
import { EVIDENCE_COLLECTOR, EVIDENCE_REPOSITORY } from '../tokens';
import { EvidenceCollectorPort } from '../ports/evidence-collector.port';
import { EvidenceRepositoryPort } from '../ports/evidence-repository.port';

@Injectable()
export class EvidenceCollectionService {
  constructor(
    @Inject(EVIDENCE_COLLECTOR)
    private readonly collector: EvidenceCollectorPort,
    @Inject(EVIDENCE_REPOSITORY)
    private readonly repository: EvidenceRepositoryPort,
  ) {}

  async collect(platformId: string, requested?: EvidenceDomain[]): Promise<ProductionEvidence[]> {
    const domains = requested?.length ? requested : REQUIRED_EVIDENCE_DOMAINS;
    const evidence = await this.collector.collect(platformId, domains);
    await this.repository.saveEvidence(evidence);
    return evidence;
  }

  async get(platformId: string): Promise<ProductionEvidence[]> {
    return this.repository.getEvidence(platformId);
  }
}

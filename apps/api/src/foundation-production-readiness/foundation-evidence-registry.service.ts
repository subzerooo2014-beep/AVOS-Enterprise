import { Injectable } from '@nestjs/common';
import { ReleaseEvidence } from './foundation-production-readiness.types';

@Injectable()
export class FoundationEvidenceRegistryService {
  private readonly evidence = new Map<string, ReleaseEvidence>();

  register(item: ReleaseEvidence): ReleaseEvidence {
    this.evidence.set(item.id, { ...item });
    return { ...item };
  }

  list(): ReleaseEvidence[] {
    return [...this.evidence.values()].map((item) => ({ ...item }));
  }

  summary() {
    const evidence = this.list();
    return {
      total: evidence.length,
      verified: evidence.filter((item) => item.verified).length,
      unverified: evidence
        .filter((item) => !item.verified)
        .map((item) => item.id),
      categories: [...new Set(evidence.map((item) => item.category))],
    };
  }
}
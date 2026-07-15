import { Injectable } from '@nestjs/common';

@Injectable()
export class ReleaseEvidenceRegistryService {
  private readonly evidence = new Map<
    string,
    Array<{ id: string; type: string; path: string }>
  >();

  register(
    releaseCandidateId: string,
    item: { id: string; type: string; path: string },
  ) {
    const existing = this.evidence.get(releaseCandidateId) ?? [];
    existing.push({ ...item });
    this.evidence.set(releaseCandidateId, existing);

    return {
      releaseCandidateId,
      evidence: [...existing],
    };
  }

  list(releaseCandidateId: string) {
    return [
      ...(this.evidence.get(releaseCandidateId) ?? []),
    ];
  }
}
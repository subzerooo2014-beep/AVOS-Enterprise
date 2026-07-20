import { Injectable } from '@nestjs/common';
import { EvidenceRegistryService } from './evidence-registry.service';
import {
  KnowledgeQueryInput,
  KnowledgeQueryResult,
} from './knowledge-runtime.types';

@Injectable()
export class KnowledgeQueryService {
  private queryCount = 0;

  constructor(private readonly evidence: EvidenceRegistryService) {}

  search(input: KnowledgeQueryInput): KnowledgeQueryResult {
    this.queryCount += 1;

    const queryTerms = input.query
      .toLowerCase()
      .split(/\s+/)
      .filter((term) => term.length > 2);

    const requiredTags = new Set(input.tags ?? []);
    const minConfidence = input.minConfidence ?? 0;

    const evidence = this.evidence
      .approvedForProject(input.projectId, input.livingVisionId)
      .filter((record) => record.confidence >= minConfidence)
      .filter((record) => {
        const searchable = [
          record.title,
          record.content,
          record.tags.join(' '),
        ]
          .join(' ')
          .toLowerCase();

        const queryMatch =
          queryTerms.length === 0 ||
          queryTerms.some((term) => searchable.includes(term));

        const tagMatch =
          requiredTags.size === 0 ||
          [...requiredTags].every((tag) => record.tags.includes(tag));

        return queryMatch && tagMatch;
      })
      .sort(
        (a, b) =>
          b.qualityScore - a.qualityScore ||
          b.confidence - a.confidence,
      );

    return {
      query: input.query,
      evidence,
      total: evidence.length,
      generatedAt: new Date().toISOString(),
    };
  }

  metrics() {
    return {
      queries: this.queryCount,
    };
  }
}
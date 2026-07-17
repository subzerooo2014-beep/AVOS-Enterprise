import { Injectable } from "@nestjs/common";
import { KnowledgeRecord } from "../knowledge.types";
import { KnowledgeRuntimeCacheService } from "./knowledge-runtime-cache.service";
import { KnowledgeRuntimePolicyService } from "./knowledge-runtime-policy.service";
import { KnowledgeRuntimeContextItem, KnowledgeRuntimeDiagnostics, KnowledgeRuntimeRequest } from "./knowledge-runtime.types";

@Injectable()
export class KnowledgeRetrievalPipelineService {
  constructor(
    private readonly cache: KnowledgeRuntimeCacheService,
    private readonly policy: KnowledgeRuntimePolicyService,
  ) {}

  retrieve(records: KnowledgeRecord[], request: KnowledgeRuntimeRequest, diagnostics: KnowledgeRuntimeDiagnostics): KnowledgeRuntimeContextItem[] {
    const queryTerms = request.query.toLowerCase().split(/\s+/).filter(Boolean);
    const items: KnowledgeRuntimeContextItem[] = [];

    for (const record of records) {
      if (!this.policy.canAccess(record, request.principal)) {
        diagnostics.policyDenied += 1;
        continue;
      }

      const key = `${record.dna.identity.id}:${record.dna.identity.version}`;
      const cached = this.cache.get(key);
      if (cached) {
        diagnostics.cacheHits += 1;
        items.push({ ...cached, source: "CACHE" });
        continue;
      }
      diagnostics.cacheMisses += 1;
      const searchable = `${record.dna.identity.name} ${record.dna.purpose} ${record.dna.tags.join(" ")} ${record.metadata.keywords.join(" ")}`.toLowerCase();
      const matched = queryTerms.filter((term) => searchable.includes(term)).length;
      const relevanceScore = queryTerms.length === 0 ? 1 : matched / queryTerms.length;
      const item: KnowledgeRuntimeContextItem = {
        knowledgeId: record.dna.identity.id,
        key: record.dna.identity.key,
        name: record.dna.identity.name,
        namespace: record.dna.identity.namespace,
        version: record.dna.identity.version,
        content: structuredClone(record.currentContent),
        tags: [...record.dna.tags],
        trustScore: record.dna.trustScore,
        confidenceScore: record.dna.confidenceScore,
        relevanceScore,
        source: "REGISTRY",
      };
      this.cache.set(key, item);
      items.push(item);
    }

    return items.sort((a, b) => (b.relevanceScore + b.trustScore / 100) - (a.relevanceScore + a.trustScore / 100));
  }
}

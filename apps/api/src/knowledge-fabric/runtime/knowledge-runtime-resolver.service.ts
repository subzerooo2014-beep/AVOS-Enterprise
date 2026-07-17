import { Injectable } from "@nestjs/common";
import { KnowledgeRegistryService } from "../knowledge-registry.service";
import { KnowledgeRecord } from "../knowledge.types";
import { KnowledgeRuntimeRequest } from "./knowledge-runtime.types";

@Injectable()
export class KnowledgeRuntimeResolverService {
  constructor(private readonly registry: KnowledgeRegistryService) {}

  resolve(request: KnowledgeRuntimeRequest): KnowledgeRecord[] {
    const limit = Math.min(Math.max(request.limit ?? 20, 1), 100);
    const query = request.query.trim().toLowerCase();
    const requestedIds = new Set(request.knowledgeIds ?? []);
    const requestedTags = new Set((request.tags ?? []).map((tag) => tag.toLowerCase()));

    return this.registry
      .list()
      .filter((record) => request.includeDeprecated || record.dna.status === "ACTIVE")
      .filter((record) => !request.namespace || record.dna.identity.namespace === request.namespace)
      .filter((record) => record.dna.trustScore >= (request.minimumTrustScore ?? 0))
      .filter((record) => requestedIds.size === 0 || requestedIds.has(record.dna.identity.id))
      .filter((record) => requestedTags.size === 0 || record.dna.tags.some((tag) => requestedTags.has(tag.toLowerCase())))
      .filter((record) => {
        if (!query) return true;
        const haystack = [
          record.dna.identity.key,
          record.dna.identity.name,
          record.dna.identity.namespace,
          record.dna.purpose,
          ...record.dna.tags,
          ...record.metadata.keywords,
        ].join(" ").toLowerCase();
        return haystack.includes(query) || query.split(/\s+/).some((term) => haystack.includes(term));
      })
      .slice(0, limit);
  }
}

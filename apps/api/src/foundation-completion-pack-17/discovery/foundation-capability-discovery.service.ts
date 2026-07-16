import { Injectable } from "@nestjs/common";
import {
  FoundationCapabilityDiscoveryQuery,
  FoundationCapabilityDiscoveryResult
} from "../foundation-pack-17.types";
import { FoundationCapabilityRegistryService } from "../registry/foundation-capability-registry.service";
import { FoundationSdkAuditService } from "../observability/foundation-sdk-audit.service";

@Injectable()
export class FoundationCapabilityDiscoveryService {
  constructor(
    private readonly registry: FoundationCapabilityRegistryService,
    private readonly audit: FoundationSdkAuditService
  ) {}

  discover(
    query: FoundationCapabilityDiscoveryQuery,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    const results: FoundationCapabilityDiscoveryResult[] = [];

    for (const capability of this.registry.list()) {
      if (
        query.domains &&
        !query.domains.includes(capability.domain)
      ) {
        continue;
      }

      if (
        query.operationTypes &&
        !query.operationTypes.every((type) =>
          capability.operationTypes.includes(type)
        )
      ) {
        continue;
      }

      if (
        query.tags &&
        !query.tags.every((tag) =>
          capability.tags.includes(tag)
        )
      ) {
        continue;
      }

      if (
        query.status &&
        !query.status.includes(capability.status)
      ) {
        continue;
      }

      let score = 0;
      const reasons: string[] = [];

      if (query.text) {
        const text = query.text.toLowerCase();

        if (
          capability.name.toLowerCase().includes(text)
        ) {
          score += 40;
          reasons.push("Capability name match.");
        }

        if (
          capability.description
            .toLowerCase()
            .includes(text)
        ) {
          score += 30;
          reasons.push("Capability description match.");
        }

        if (
          capability.tags.some((tag) =>
            tag.toLowerCase().includes(text)
          )
        ) {
          score += 20;
          reasons.push("Capability tag match.");
        }

        if (
          capability.domain.toLowerCase().includes(text)
        ) {
          score += 10;
          reasons.push("Capability domain match.");
        }

        if (score === 0) {
          continue;
        }
      }
      else {
        score = 50;
        reasons.push("Structured filter match.");
      }

      if (capability.status === "active") {
        score += 10;
        reasons.push("Capability is active.");
      }

      if (capability.contractId) {
        score += 10;
        reasons.push("Capability has a contract.");
      }

      results.push({
        capability,
        score: Math.min(100, score),
        reasons
      });
    }

    const limited = results
      .sort((left, right) => right.score - left.score)
      .slice(0, Math.max(1, query.limit ?? 20));

    this.audit.record({
      correlationId: context.correlationId,
      category: "discovery",
      action: "foundation-capability-discovery-executed",
      subjectId: "foundation-sdk",
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        query,
        results: limited.length
      }
    });

    return {
      query,
      results: limited,
      total: limited.length,
      discoveredAt: new Date().toISOString()
    };
  }
}

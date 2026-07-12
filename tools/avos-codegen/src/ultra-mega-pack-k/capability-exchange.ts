import { randomUUID } from "node:crypto";
import { UltraKValue } from "./contracts";

export interface EnterpriseCapability {
  key: string;
  provider: string;
  category: string;
  version: string;
  reliability: number;
  capacity: number;
  tags: string[];
  metadata: Record<string, UltraKValue>;
}

export interface CapabilityRequest {
  key: string;
  requiredCategory: string;
  requiredTags: string[];
  minimumReliability: number;
  workload: number;
}

export interface CapabilityMatch {
  id: string;
  requestKey: string;
  capabilityKey: string;
  provider: string;
  score: number;
  allocatedWorkload: number;
}

export interface CapabilityExchangeResult {
  matches: CapabilityMatch[];
  unmatchedRequests: string[];
  providersUsed: string[];
  matchedAt: string;
}

export class UniversalCapabilityExchange {
  match(
    capabilities: readonly EnterpriseCapability[],
    requests: readonly CapabilityRequest[],
  ): CapabilityExchangeResult {
    const matches: CapabilityMatch[] = [];
    const unmatchedRequests: string[] = [];

    for (const request of requests) {
      const candidate = capabilities
        .filter(
          (capability) =>
            capability.category === request.requiredCategory &&
            capability.reliability >= request.minimumReliability &&
            capability.capacity >= request.workload,
        )
        .map((capability) => {
          const tagCoverage =
            request.requiredTags.length === 0
              ? 100
              : Math.round(
                  (request.requiredTags.filter((tag) =>
                    capability.tags.includes(tag),
                  ).length /
                    request.requiredTags.length) *
                    100,
                );

          return {
            capability,
            score: Math.round(
              capability.reliability * 0.6 +
                tagCoverage * 0.3 +
                Math.min(100, capability.capacity) * 0.1,
            ),
          };
        })
        .sort((a, b) => b.score - a.score)[0];

      if (!candidate) {
        unmatchedRequests.push(request.key);
        continue;
      }

      matches.push({
        id: randomUUID(),
        requestKey: request.key,
        capabilityKey: candidate.capability.key,
        provider: candidate.capability.provider,
        score: candidate.score,
        allocatedWorkload: request.workload,
      });
    }

    return {
      matches,
      unmatchedRequests,
      providersUsed: Array.from(new Set(matches.map((match) => match.provider))),
      matchedAt: new Date().toISOString(),
    };
  }
}

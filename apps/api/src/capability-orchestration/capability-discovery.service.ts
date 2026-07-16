import { Injectable } from "@nestjs/common";
import { CapabilityRegistryService } from "../capability-fabric/capability-registry.service";
import {
  CapabilityDiscoveryQuery,
  CapabilityDiscoveryResult,
} from "./capability-orchestration.types";

@Injectable()
export class CapabilityDiscoveryService {
  constructor(private readonly registry: CapabilityRegistryService) {}

  discover(query: CapabilityDiscoveryQuery): CapabilityDiscoveryResult[] {
    const capabilities = this.registry.list({
      kind: query.kind,
      lifecycleStage: query.lifecycleStage,
      status: query.operationalStatus,
    });

    const requestedTags = (query.tags ?? []).map((tag) => tag.toLowerCase());

    return capabilities
      .map((capability) => {
        let score = 50;
        const reasons: string[] = [];

        if (query.kind && capability.identity.kind === query.kind) {
          score += 15;
          reasons.push("kind-match");
        }

        const matchedTags = requestedTags.filter((tag) =>
          capability.tags.includes(tag),
        );
        if (matchedTags.length > 0) {
          score += matchedTags.length * 10;
          reasons.push(`tag-match:${matchedTags.join(",")}`);
        }

        if (
          query.requiresContractType &&
          capability.contracts.some(
            (contract) => contract.type === query.requiresContractType,
          )
        ) {
          score += 15;
          reasons.push("contract-match");
        }

        if (capability.operationalStatus === "ACTIVE") {
          score += 10;
          reasons.push("active");
        }

        if (
          capability.lifecycleStage === "CORE_ENGINE" ||
          capability.lifecycleStage === "PLATFORM_SERVICE"
        ) {
          score += 5;
          reasons.push("platform-maturity");
        }

        return {
          capabilityKey: capability.identity.key,
          name: capability.identity.name,
          kind: capability.identity.kind,
          version: capability.version,
          lifecycleStage: capability.lifecycleStage,
          operationalStatus: capability.operationalStatus,
          tags: [...capability.tags],
          score,
          reasons,
        };
      })
      .filter((result) =>
        requestedTags.length === 0
          ? true
          : requestedTags.every((tag) => result.tags.includes(tag)),
      )
      .sort((a, b) => b.score - a.score)
      .slice(0, query.limit ?? 20);
  }
}
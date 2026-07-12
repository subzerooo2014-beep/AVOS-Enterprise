import { randomUUID } from "node:crypto";
import { UltraJValue } from "./contracts";

export interface FederatedKnowledgeNode {
  key: string;
  domain: string;
  confidence: number;
  concepts: string[];
  payload: Record<string, UltraJValue>;
}

export interface KnowledgeFederationLink {
  id: string;
  source: string;
  target: string;
  sharedConcepts: string[];
  confidence: number;
}

export interface UniversalKnowledgeFabricResult {
  nodes: number;
  links: KnowledgeFederationLink[];
  domains: string[];
  federationScore: number;
  federatedAt: string;
}

export class UniversalKnowledgeFabric {
  federate(
    nodes: readonly FederatedKnowledgeNode[],
  ): UniversalKnowledgeFabricResult {
    const links: KnowledgeFederationLink[] = [];

    for (let leftIndex = 0; leftIndex < nodes.length; leftIndex += 1) {
      const left = nodes[leftIndex];
      if (!left) continue;

      for (let rightIndex = leftIndex + 1; rightIndex < nodes.length; rightIndex += 1) {
        const right = nodes[rightIndex];
        if (!right) continue;

        const sharedConcepts = left.concepts.filter((concept) =>
          right.concepts.includes(concept),
        );

        if (sharedConcepts.length === 0) continue;

        links.push({
          id: randomUUID(),
          source: left.key,
          target: right.key,
          sharedConcepts,
          confidence: Math.round((left.confidence + right.confidence) / 2),
        });
      }
    }

    const federationScore =
      nodes.length <= 1
        ? 100
        : Math.min(
            100,
            Math.round(
              (links.length / Math.max(1, (nodes.length * (nodes.length - 1)) / 2)) *
                100,
            ),
          );

    return {
      nodes: nodes.length,
      links,
      domains: Array.from(new Set(nodes.map((node) => node.domain))).sort(),
      federationScore,
      federatedAt: new Date().toISOString(),
    };
  }
}

import { randomUUID } from "node:crypto";

export interface InnovationNode {
  key: string;
  region: string;
  domain: string;
  expertise: string[];
  reliability: number;
}

export interface InnovationOpportunity {
  key: string;
  domain: string;
  requiredExpertise: string[];
  marketImpact: number;
  implementationReadiness: number;
  complexity: number;
}

export interface InnovationNetworkProposal {
  id: string;
  opportunityKey: string;
  leadNodeKey: string;
  score: number;
  collaborators: string[];
  roadmapPhase: "now" | "next" | "later";
}

export interface GlobalInnovationNetworkResult {
  proposals: InnovationNetworkProposal[];
  unmatchedOpportunities: string[];
  regionsActivated: string[];
  generatedAt: string;
}

export class GlobalInnovationNetwork {
  connect(
    nodes: readonly InnovationNode[],
    opportunities: readonly InnovationOpportunity[],
  ): GlobalInnovationNetworkResult {
    const proposals: InnovationNetworkProposal[] = [];
    const unmatchedOpportunities: string[] = [];

    for (const opportunity of opportunities) {
      const candidates = nodes
        .filter((node) => node.domain === opportunity.domain)
        .map((node) => {
          const expertiseCoverage =
            opportunity.requiredExpertise.length === 0
              ? 100
              : Math.round(
                  (opportunity.requiredExpertise.filter((item) =>
                    node.expertise.includes(item),
                  ).length /
                    opportunity.requiredExpertise.length) *
                    100,
                );

          return {
            node,
            score: Math.round(
              expertiseCoverage * 0.35 +
                node.reliability * 0.25 +
                opportunity.marketImpact * 0.2 +
                opportunity.implementationReadiness * 0.15 +
                Math.max(0, 100 - opportunity.complexity) * 0.05,
            ),
          };
        })
        .sort((a, b) => b.score - a.score);

      const lead = candidates[0];

      if (!lead || lead.score < 55) {
        unmatchedOpportunities.push(opportunity.key);
        continue;
      }

      proposals.push({
        id: randomUUID(),
        opportunityKey: opportunity.key,
        leadNodeKey: lead.node.key,
        score: lead.score,
        collaborators: candidates
          .slice(1, 3)
          .filter((candidate) => candidate.score >= 50)
          .map((candidate) => candidate.node.key),
        roadmapPhase:
          lead.score >= 85 ? "now" : lead.score >= 70 ? "next" : "later",
      });
    }

    return {
      proposals,
      unmatchedOpportunities,
      regionsActivated: Array.from(
        new Set(
          proposals
            .map((proposal) =>
              nodes.find((node) => node.key === proposal.leadNodeKey)?.region,
            )
            .filter((region): region is string => Boolean(region)),
        ),
      ),
      generatedAt: new Date().toISOString(),
    };
  }
}

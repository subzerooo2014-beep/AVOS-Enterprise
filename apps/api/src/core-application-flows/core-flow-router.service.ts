import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import type { FlowRouteDecision } from "./core-flow-federation.types";
import { CoreFlowFederationService } from "./core-flow-federation.service";

@Injectable()
export class CoreFlowRouterService {
  private readonly decisions: FlowRouteDecision[] = [];

  constructor(private readonly federation: CoreFlowFederationService) {}

  route(flow: string, dto: any = {}) {
    const nodes = this.federation.findAll({ status: "active" }).filter((node) => {
      const required = Array.isArray(dto?.requiredCapabilities)
        ? dto.requiredCapabilities
        : [];
      return required.every((capability: string) =>
        node.capabilities.includes(capability),
      );
    });

    if (nodes.length === 0) {
      throw new ServiceUnavailableException("No eligible federation node available.");
    }

    const preferredRegion = String(dto?.region ?? "");
    const ranked = nodes
      .map((node) => {
        const regionalScore = preferredRegion && node.region === preferredRegion ? 30 : 0;
        const loadScore = 100 - node.load;
        const capabilityScore = node.capabilities.length;
        return {
          node,
          score: loadScore + regionalScore + capabilityScore,
        };
      })
      .sort((a, b) => b.score - a.score);

    const selected = ranked[0];
    const strategy: FlowRouteDecision["strategy"] =
      preferredRegion && selected.node.region === preferredRegion
        ? "regional-affinity"
        : Array.isArray(dto?.requiredCapabilities) && dto.requiredCapabilities.length
          ? "capability-match"
          : "lowest-load";

    const decision: FlowRouteDecision = {
      id: `route_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      flow,
      nodeId: selected.node.id,
      strategy,
      score: selected.score,
      decidedAt: new Date().toISOString(),
    };

    this.decisions.push(decision);
    return { decision, node: selected.node };
  }

  history(flow?: string) {
    return this.decisions
      .filter((decision) => !flow || decision.flow === flow)
      .slice()
      .reverse();
  }
}

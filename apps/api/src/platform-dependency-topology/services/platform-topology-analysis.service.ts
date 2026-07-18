import { Injectable } from "@nestjs/common";
import { PlatformTopologyReport } from "../contracts/platform-dependency.contracts";
import { PlatformDependencyGraphService } from "./platform-dependency-graph.service";

@Injectable()
export class PlatformTopologyAnalysisService {
  constructor(private readonly graphService: PlatformDependencyGraphService) {}

  analyze(): PlatformTopologyReport {
    const graph = this.graphService.build();
    const roots = graph.nodes
      .filter((node) => node.incoming.length === 0)
      .map((node) => node.serviceId)
      .sort();

    const leaves = graph.nodes
      .filter((node) => node.outgoing.length === 0)
      .map((node) => node.serviceId)
      .sort();

    const criticalNodes = graph.nodes
      .map((node) => ({
        serviceId: node.serviceId,
        dependentCount: node.incoming.length
      }))
      .filter((item) => item.dependentCount > 0)
      .sort((a, b) => b.dependentCount - a.dependentCount);

    const threshold = Math.max(2, Math.ceil(graph.nodes.length * 0.25));
    const singlePointsOfFailure = criticalNodes
      .filter((item) => item.dependentCount >= threshold)
      .map((item) => item.serviceId);

    const cycles = this.graphService.detectCycles();
    const topologyScore = Math.max(
      0,
      100 -
        cycles.length * 25 -
        singlePointsOfFailure.length * 5
    );

    return {
      services: graph.nodes.length,
      links: graph.edges.length,
      roots,
      leaves,
      criticalNodes,
      singlePointsOfFailure,
      topologyScore,
      generatedAt: new Date().toISOString()
    };
  }
}
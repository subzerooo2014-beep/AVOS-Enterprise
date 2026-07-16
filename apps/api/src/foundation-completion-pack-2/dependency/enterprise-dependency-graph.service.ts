import { Injectable } from "@nestjs/common";
import { DependencyEdge } from "../foundation-pack-2.types";
import { UnifiedCapabilityRegistryService } from "../capability/unified-capability-registry.service";

@Injectable()
export class EnterpriseDependencyGraphService {
  private readonly edges: DependencyEdge[] = [
    {
      from: "capability:foundation-control-plane",
      to: "capability:constitutional-foundation",
      relation: "depends-on",
      criticality: "critical"
    },
    {
      from: "capability:foundation-control-plane",
      to: "capability:foundation-governance",
      relation: "depends-on",
      criticality: "high"
    },
    {
      from: "capability:foundation-control-plane",
      to: "capability:enterprise-metadata",
      relation: "depends-on",
      criticality: "high"
    },
    {
      from: "capability:foundation-governance",
      to: "capability:constitutional-foundation",
      relation: "governed-by",
      criticality: "critical"
    },
    {
      from: "capability:enterprise-metadata",
      to: "capability:constitutional-foundation",
      relation: "governed-by",
      criticality: "high"
    }
  ];

  constructor(
    private readonly capabilityRegistry: UnifiedCapabilityRegistryService
  ) {}

  graph() {
    return {
      nodes: this.capabilityRegistry.list(),
      edges: this.edges
    };
  }

  impact(targetId: string) {
    const directDependents = this.edges
      .filter((edge) => edge.to === targetId)
      .map((edge) => ({
        capabilityId: edge.from,
        relation: edge.relation,
        criticality: edge.criticality
      }));

    const directDependencies = this.edges
      .filter((edge) => edge.from === targetId)
      .map((edge) => ({
        capabilityId: edge.to,
        relation: edge.relation,
        criticality: edge.criticality
      }));

    const highestCriticality =
      directDependents.some((item) => item.criticality === "critical")
        ? "critical"
        : directDependents.some((item) => item.criticality === "high")
          ? "high"
          : directDependents.some((item) => item.criticality === "medium")
            ? "medium"
            : "low";

    return {
      targetId,
      directDependents,
      directDependencies,
      affectedCapabilities: directDependents.length,
      riskLevel: highestCriticality,
      humanApprovalRequired:
        highestCriticality === "critical" || highestCriticality === "high"
    };
  }

  summary() {
    return {
      nodes: this.capabilityRegistry.list().length,
      edges: this.edges.length,
      criticalEdges: this.edges.filter(
        (edge) => edge.criticality === "critical"
      ).length,
      highEdges: this.edges.filter((edge) => edge.criticality === "high").length
    };
  }
}

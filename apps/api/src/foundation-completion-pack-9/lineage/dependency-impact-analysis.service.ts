import { Injectable } from "@nestjs/common";
import {
  DependencyImpactResult
} from "../foundation-pack-9.types";
import { EnterpriseDependencyGraphService } from "../dependencies/enterprise-dependency-graph.service";
import { Foundation9AuditService } from "../observability/foundation-9-audit.service";

@Injectable()
export class DependencyImpactAnalysisService {
  constructor(
    private readonly graph: EnterpriseDependencyGraphService,
    private readonly audit: Foundation9AuditService
  ) {}

  calculate(input: {
    rootNodeId: string;
    correlationId: string;
    actorIdentityId: string;
  }): DependencyImpactResult {
    this.graph.getNode(input.rootNodeId);

    const direct = this.graph
      .incoming(input.rootNodeId)
      .map((edge) => edge.fromNodeId);

    const visited = new Set<string>();
    const queue = [...direct];

    while (queue.length > 0) {
      const current = queue.shift();

      if (!current || visited.has(current)) {
        continue;
      }

      visited.add(current);

      for (const edge of this.graph.incoming(current)) {
        if (!visited.has(edge.fromNodeId)) {
          queue.push(edge.fromNodeId);
        }
      }
    }

    const impactedNodeIds = Array.from(
      new Set([...direct, ...visited])
    );

    const criticalPathNodeIds = impactedNodeIds.filter(
      (nodeId) =>
        this.graph
          .outgoing(nodeId)
          .some(
            (edge) =>
              edge.criticality === "critical" &&
              edge.toNodeId === input.rootNodeId
          )
    );

    const risks: string[] = [];

    if (impactedNodeIds.length > 10) {
      risks.push(
        "High dependency fan-out detected."
      );
    }

    if (criticalPathNodeIds.length > 0) {
      risks.push(
        "Critical downstream dependencies will be impacted."
      );
    }

    const result: DependencyImpactResult = {
      rootNodeId: input.rootNodeId,
      impactedNodeIds,
      criticalPathNodeIds,
      directDependents: direct,
      transitiveDependents: impactedNodeIds.filter(
        (nodeId) => !direct.includes(nodeId)
      ),
      risks,
      calculatedAt: new Date().toISOString()
    };

    this.audit.record({
      correlationId: input.correlationId,
      category: "impact",
      action: "dependency-impact-calculated",
      subjectId: input.rootNodeId,
      actorIdentityId: input.actorIdentityId,
      outcome:
        risks.length > 0 ? "warning" : "success",
      metadata: {
        impacted: impactedNodeIds.length,
        critical: criticalPathNodeIds.length,
        risks
      }
    });

    return result;
  }
}

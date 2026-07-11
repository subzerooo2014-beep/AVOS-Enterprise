import {
  Injectable,
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  CascadingFailureAnalysis,
  CascadingFailurePath,
  CascadingFailureRisk,
  DependencyHealthStatus,
  DependencyRelationshipType,
  GovernanceAuditEventType,
  RuntimeDependencyEdge,
} from "../contracts";
import {
  RuntimeGovernanceStore,
} from "../stores/runtime-governance.store";
import {
  cascadeRiskFromScore,
  clampGovernanceScore,
} from "../utils";
import {
  RuntimeDependencyGraphService,
} from "./runtime-dependency-graph.service";
import {
  RuntimeGovernanceAuditService,
} from "./runtime-governance-audit.service";

@Injectable()
export class RuntimeCascadingFailureService {
  constructor(
    private readonly store:
      RuntimeGovernanceStore,
    private readonly graph:
      RuntimeDependencyGraphService,
    private readonly audit:
      RuntimeGovernanceAuditService,
  ) {}

  analyze(
    sourceNodeId: string,
  ): CascadingFailureAnalysis {
    const source =
      this.graph.getNode(
        sourceNodeId,
      );

    const paths =
      this.discoverPaths(
        sourceNodeId,
      );

    const affectedNodeIds =
      new Set<string>();

    const affectedServices =
      new Set<string>();

    let cumulativeRisk = 0;

    for (const path of paths) {
      for (
        const nodeId of
        path.nodeIds
      ) {
        if (
          nodeId !==
          sourceNodeId
        ) {
          affectedNodeIds.add(
            nodeId,
          );
        }

        const node =
          this.store
            .getDependencyNode(
              nodeId,
            );

        if (
          node?.service
        ) {
          affectedServices.add(
            node.service,
          );
        }
      }

      cumulativeRisk +=
        path.cumulativeCriticality;
    }

    const directDependents =
      this.graph
        .getIncomingEdges(
          sourceNodeId,
        ).length;

    const healthPenalty =
      this.healthPenalty(
        source.healthStatus,
      );

    const pathPenalty =
      Math.min(
        40,
        paths.length * 5,
      );

    const dependentPenalty =
      Math.min(
        20,
        affectedNodeIds.size * 3,
      );

    const criticalityPenalty =
      Math.round(
        source.criticality * 0.3,
      );

    const cumulativePenalty =
      Math.min(
        25,
        Math.round(
          cumulativeRisk /
          Math.max(
            1,
            paths.length,
          ) *
          0.15,
        ),
      );

    const riskScore =
      clampGovernanceScore(
        healthPenalty +
        pathPenalty +
        dependentPenalty +
        criticalityPenalty +
        cumulativePenalty,
      );

    const risk =
      cascadeRiskFromScore(
        riskScore,
      );

    const recommendations =
      this.buildRecommendations(
        risk,
        affectedNodeIds.size,
        affectedServices.size,
        source.healthStatus,
      );

    const analysis:
      CascadingFailureAnalysis = {
      id:
        randomUUID(),
      sourceNodeId:
        source.id,
      risk,
      riskScore,
      directDependents,
      totalAffectedNodes:
        affectedNodeIds.size,
      affectedServiceCount:
        affectedServices.size,
      paths,
      recommendations,
      analyzedAt:
        new Date().toISOString(),
    };

    const saved =
      this.store
        .saveCascadeAnalysis(
          analysis,
        );

    this.audit.append({
      type:
        GovernanceAuditEventType
          .CASCADE_ANALYZED,
      aggregateType:
        "cascading_failure_analysis",
      aggregateId:
        saved.id,
      actor: {
        id:
          "avos-cascade-analyzer",
        type:
          "system",
        name:
          "AVOS Cascade Analyzer",
        roles: [
          "runtime_governance",
          "resilience_analysis",
        ],
      },
      payload: {
        analysisId:
          saved.id,
        sourceNodeId:
          saved.sourceNodeId,
        risk:
          saved.risk,
        riskScore:
          saved.riskScore,
        directDependents:
          saved.directDependents,
        totalAffectedNodes:
          saved.totalAffectedNodes,
        affectedServiceCount:
          saved.affectedServiceCount,
        paths:
          saved.paths.length,
      },
    });

    return saved;
  }

  list():
    CascadingFailureAnalysis[] {
    return this.store
      .listCascadeAnalyses();
  }

  private discoverPaths(
    sourceNodeId: string,
  ): CascadingFailurePath[] {
    const edges =
      this.store
        .listDependencyEdges();

    const reverseAdjacency =
      new Map<
        string,
        RuntimeDependencyEdge[]
      >();

    for (const edge of edges) {
      const incoming =
        reverseAdjacency.get(
          edge.targetNodeId,
        ) ?? [];

      incoming.push(edge);

      reverseAdjacency.set(
        edge.targetNodeId,
        incoming,
      );
    }

    const paths:
      CascadingFailurePath[] = [];

    const walk = (
      currentNodeId: string,
      nodeIds: string[],
      edgeIds: string[],
      cumulativeCriticality: number,
      visited: Set<string>,
    ): void => {
      const dependents =
        reverseAdjacency.get(
          currentNodeId,
        ) ?? [];

      for (
        const edge of dependents
      ) {
        if (
          visited.has(
            edge.sourceNodeId,
          )
        ) {
          continue;
        }

        if (
          edge.relationshipType ===
            DependencyRelationshipType.OPTIONAL ||
          edge.relationshipType ===
            DependencyRelationshipType.FALLBACK
        ) {
          continue;
        }

        const dependent =
          this.store
            .getDependencyNode(
              edge.sourceNodeId,
            );

        if (!dependent) {
          continue;
        }

        const nextNodeIds = [
          ...nodeIds,
          dependent.id,
        ];

        const nextEdgeIds = [
          ...edgeIds,
          edge.id,
        ];

        const nextCriticality =
          cumulativeCriticality +
          edge.criticality +
          dependent.criticality;

        const affectedServices =
          nextNodeIds
            .map(
              (nodeId) =>
                this.store
                  .getDependencyNode(
                    nodeId,
                  )?.service,
            )
            .filter(
              (
                service,
              ): service is string =>
                Boolean(service),
            );

        paths.push({
          nodeIds:
            nextNodeIds,
          edgeIds:
            nextEdgeIds,
          cumulativeCriticality:
            nextCriticality,
          affectedServices:
            Array.from(
              new Set(
                affectedServices,
              ),
            ),
          risk:
            cascadeRiskFromScore(
              Math.min(
                100,
                Math.round(
                  nextCriticality /
                  nextNodeIds.length,
                ),
              ),
            ),
        });

        const nextVisited =
          new Set(visited);

        nextVisited.add(
          dependent.id,
        );

        walk(
          dependent.id,
          nextNodeIds,
          nextEdgeIds,
          nextCriticality,
          nextVisited,
        );
      }
    };

    walk(
      sourceNodeId,
      [sourceNodeId],
      [],
      0,
      new Set([
        sourceNodeId,
      ]),
    );

    return paths;
  }

  private healthPenalty(
    status:
      DependencyHealthStatus,
  ): number {
    switch (status) {
      case DependencyHealthStatus.UNAVAILABLE:
        return 45;

      case DependencyHealthStatus.UNHEALTHY:
        return 35;

      case DependencyHealthStatus.DEGRADED:
        return 20;

      case DependencyHealthStatus.UNKNOWN:
        return 10;

      case DependencyHealthStatus.HEALTHY:
      default:
        return 0;
    }
  }

  private buildRecommendations(
    risk: CascadingFailureRisk,
    affectedNodes: number,
    affectedServices: number,
    healthStatus:
      DependencyHealthStatus,
  ): string[] {
    const recommendations:
      string[] = [];

    if (
      healthStatus ===
        DependencyHealthStatus.UNHEALTHY ||
      healthStatus ===
        DependencyHealthStatus.UNAVAILABLE
    ) {
      recommendations.push(
        "Initiate immediate dependency isolation assessment",
      );
    }

    if (
      affectedNodes >= 3
    ) {
      recommendations.push(
        "Reduce dependency blast radius through segmentation",
      );
    }

    if (
      affectedServices >= 2
    ) {
      recommendations.push(
        "Activate cross-service incident coordination",
      );
    }

    if (
      risk ===
        CascadingFailureRisk.HIGH ||
      risk ===
        CascadingFailureRisk.CRITICAL
    ) {
      recommendations.push(
        "Require manual governance approval before dependent deployments",
      );

      recommendations.push(
        "Validate fallback and rollback paths",
      );

      recommendations.push(
        "Increase monitoring frequency for all affected nodes",
      );
    }

    if (
      recommendations.length === 0
    ) {
      recommendations.push(
        "Continue standard dependency monitoring",
      );
    }

    return recommendations;
  }
}

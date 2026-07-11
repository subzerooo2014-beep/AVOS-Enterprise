import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  GovernanceImpactAnalysis,
  GovernanceImpactCategory,
  GovernanceImpactItem,
  GovernanceJsonValue,
  GovernanceRiskLevel,
} from "../contracts";
import {
  AnalyzeGovernanceImpactDto,
} from "../dto";
import {
  RuntimeGovernanceStore,
} from "../stores/runtime-governance.store";
import {
  clampGovernanceScore,
  governanceRiskFromScore,
} from "../utils";
import {
  RuntimeGovernanceRequestService,
} from "./runtime-governance-request.service";

@Injectable()
export class RuntimeGovernanceImpactService {
  constructor(
    private readonly store:
      RuntimeGovernanceStore,
    private readonly requests:
      RuntimeGovernanceRequestService,
  ) {}

  analyze(
    requestId: string,
    dto: AnalyzeGovernanceImpactDto,
  ): GovernanceImpactAnalysis {
    const request =
      this.requests.get(requestId);

    const nodes =
      this.store.listDependencyNodes();

    const edges =
      this.store.listDependencyEdges();

    const relevantNodes =
      nodes.filter(
        (node) =>
          node.environment ===
            request.environment &&
          node.namespace ===
            request.namespace &&
          (
            !request.service ||
            node.service ===
              request.service ||
            node.key ===
              request.service
          ),
      );

    const directNodeIds =
      new Set(
        relevantNodes.map(
          (node) => node.id,
        ),
      );

    const indirectNodeIds =
      new Set<string>();

    for (const edge of edges) {
      if (
        directNodeIds.has(
          edge.sourceNodeId,
        )
      ) {
        indirectNodeIds.add(
          edge.targetNodeId,
        );
      }

      if (
        directNodeIds.has(
          edge.targetNodeId,
        )
      ) {
        indirectNodeIds.add(
          edge.sourceNodeId,
        );
      }
    }

    for (const id of directNodeIds) {
      indirectNodeIds.delete(id);
    }

    const items:
      GovernanceImpactItem[] = [];

    for (const node of relevantNodes) {
      const score =
        clampGovernanceScore(
          node.criticality * 0.6 +
          (100 - node.healthScore) * 0.4,
        );

      items.push({
        id:
          randomUUID(),
        category:
          GovernanceImpactCategory.DEPENDENCY,
        resourceId:
          node.id,
        resourceName:
          node.name,
        direct:
          true,
        impactScore:
          score,
        riskLevel:
          governanceRiskFromScore(
            score,
          ),
        reason:
          "Direct dependency impact detected",
        metadata: {
          healthStatus:
            node.healthStatus,
          criticality:
            node.criticality,
        },
      });
    }

    for (const nodeId of indirectNodeIds) {
      const node =
        this.store
          .getDependencyNode(nodeId);

      if (!node) {
        continue;
      }

      const score =
        clampGovernanceScore(
          node.criticality * 0.35 +
          (100 - node.healthScore) * 0.25,
        );

      items.push({
        id:
          randomUUID(),
        category:
          GovernanceImpactCategory.DEPENDENCY,
        resourceId:
          node.id,
        resourceName:
          node.name,
        direct:
          false,
        impactScore:
          score,
        riskLevel:
          governanceRiskFromScore(
            score,
          ),
        reason:
          "Indirect dependency propagation detected",
        metadata: {
          healthStatus:
            node.healthStatus,
          criticality:
            node.criticality,
        },
      });
    }

    const context =
      (dto.context ?? {}) as Record<
        string,
        GovernanceJsonValue
      >;

    const businessImpact =
      clampGovernanceScore(
        request.businessCriticality ??
        Number(
          context.businessCriticality ??
          40,
        ),
      );

    items.push({
      id:
        randomUUID(),
      category:
        GovernanceImpactCategory.BUSINESS,
      resourceId:
        request.id,
      resourceName:
        request.title,
      direct:
        true,
      impactScore:
        businessImpact,
      riskLevel:
        governanceRiskFromScore(
          businessImpact,
        ),
      reason:
        "Business criticality impact",
      metadata: {},
    });

    const overallImpactScore =
      items.length === 0
        ? 0
        : clampGovernanceScore(
            items.reduce(
              (
                total,
                item,
              ) =>
                total +
                item.impactScore,
              0,
            ) /
            items.length,
          );

    const affectedServices =
      Array.from(
        new Set(
          items
            .map((item) =>
              this.store
                .getDependencyNode(
                  item.resourceId,
                )?.service,
            )
            .filter(
              (
                service,
              ): service is string =>
                Boolean(service),
            ),
        ),
      );

    const analysis:
      GovernanceImpactAnalysis = {
      id:
        randomUUID(),
      requestId:
        request.id,
      overallImpactScore,
      overallRiskLevel:
        governanceRiskFromScore(
          overallImpactScore,
        ),
      directlyAffectedResources:
        items.filter(
          (item) => item.direct,
        ).length,
      indirectlyAffectedResources:
        items.filter(
          (item) => !item.direct,
        ).length,
      affectedServices,
      affectedDependencies:
        items
          .filter(
            (item) =>
              item.category ===
              GovernanceImpactCategory.DEPENDENCY,
          )
          .map(
            (item) =>
              item.resourceId,
          ),
      items,
      recommendations:
        this.buildRecommendations(
          overallImpactScore,
          items,
        ),
      analyzedAt:
        new Date().toISOString(),
    };

    return this.store
      .saveImpactAnalysis(
        analysis,
      );
  }

  list():
    GovernanceImpactAnalysis[] {
    return this.store
      .listImpactAnalyses();
  }

  get(
    id: string,
  ): GovernanceImpactAnalysis {
    const item =
      this.store
        .getImpactAnalysis(id);

    if (!item) {
      throw new NotFoundException(
        `Governance impact analysis ${id} was not found`,
      );
    }

    return item;
  }

  private buildRecommendations(
    score: number,
    items: GovernanceImpactItem[],
  ): string[] {
    const recommendations:
      string[] = [];

    if (score >= 65) {
      recommendations.push(
        "Require elevated approval and phased execution",
      );

      recommendations.push(
        "Create a dedicated runtime monitoring plan",
      );
    }

    if (
      items.some(
        (item) =>
          !item.direct &&
          item.impactScore >= 40,
      )
    ) {
      recommendations.push(
        "Review indirect dependency propagation before execution",
      );
    }

    if (
      items.length >= 5
    ) {
      recommendations.push(
        "Reduce the deployment scope to limit blast radius",
      );
    }

    if (
      recommendations.length === 0
    ) {
      recommendations.push(
        "Proceed with standard impact monitoring",
      );
    }

    return recommendations;
  }
}

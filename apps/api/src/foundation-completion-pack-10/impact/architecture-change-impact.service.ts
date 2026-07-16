import { Injectable } from "@nestjs/common";
import {
  ArchitectureImpactResult
} from "../foundation-pack-10.types";
import { LivingBlueprintRegistryService } from "../blueprints/living-blueprint-registry.service";
import { ArchitectureAuditService } from "../observability/architecture-audit.service";

@Injectable()
export class ArchitectureChangeImpactService {
  constructor(
    private readonly blueprints: LivingBlueprintRegistryService,
    private readonly audit: ArchitectureAuditService
  ) {}

  calculate(input: {
    blueprintId: string;
    changedAssetIds: string[];
    actorIdentityId: string;
    correlationId: string;
  }) {
    const blueprint = this.blueprints.get(
      input.blueprintId
    );

    const changed = Array.from(
      new Set(input.changedAssetIds)
    );

    const impacted = new Set<string>();
    const queue = [...changed];

    while (queue.length > 0) {
      const current = queue.shift();

      if (!current) {
        continue;
      }

      for (const asset of blueprint.assets) {
        if (
          asset.dependencies.includes(current) &&
          !impacted.has(asset.id)
        ) {
          impacted.add(asset.id);
          queue.push(asset.id);
        }
      }
    }

    const criticalAssetIds = Array.from(impacted).filter(
      (assetId) => {
        const asset = blueprint.assets.find(
          (item) => item.id === assetId
        );

        return Boolean(
          asset?.metadata["critical"] === true ||
          asset?.metadata["tier"] === 0
        );
      }
    );

    const reasons: string[] = [];

    if (impacted.size > 10) {
      reasons.push(
        "Large transitive impact detected."
      );
    }

    if (criticalAssetIds.length > 0) {
      reasons.push(
        "Critical architecture assets are impacted."
      );
    }

    const result: ArchitectureImpactResult = {
      id: `architecture-impact:${Date.now()}`,
      blueprintId: blueprint.id,
      changedAssetIds: changed,
      impactedAssetIds: Array.from(impacted),
      criticalAssetIds,
      breakingRisk:
        criticalAssetIds.length > 0 ||
        impacted.size > 10,
      reasons,
      calculatedAt: new Date().toISOString()
    };

    this.audit.record({
      correlationId: input.correlationId,
      category: "impact",
      action: "architecture-impact-calculated",
      subjectId: result.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        result.breakingRisk
          ? "warning"
          : "success",
      metadata: {
        changed: changed.length,
        impacted: impacted.size,
        critical: criticalAssetIds.length
      }
    });

    return result;
  }
}

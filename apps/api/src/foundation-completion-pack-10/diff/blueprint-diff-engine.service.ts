import { Injectable } from "@nestjs/common";
import {
  BlueprintDiffEntry,
  BlueprintDiffResult
} from "../foundation-pack-10.types";
import { BlueprintVersionManagerService } from "../versions/blueprint-version-manager.service";
import { ArchitectureAuditService } from "../observability/architecture-audit.service";

@Injectable()
export class BlueprintDiffEngineService {
  constructor(
    private readonly versions: BlueprintVersionManagerService,
    private readonly audit: ArchitectureAuditService
  ) {}

  compare(input: {
    blueprintId: string;
    fromVersion: string;
    toVersion: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const from = this.versions.getByVersion(
      input.blueprintId,
      input.fromVersion
    ).snapshot;

    const to = this.versions.getByVersion(
      input.blueprintId,
      input.toVersion
    ).snapshot;

    const entries: BlueprintDiffEntry[] = [];
    const breakingChanges: string[] = [];

    const fromAssets = new Map(
      from.assets.map((asset) => [asset.id, asset])
    );

    const toAssets = new Map(
      to.assets.map((asset) => [asset.id, asset])
    );

    for (const [id, asset] of fromAssets.entries()) {
      if (!toAssets.has(id)) {
        entries.push({
          path: `assets.${id}`,
          changeType: "removed",
          before: asset
        });
        breakingChanges.push(
          `Asset removed: ${id}`
        );
      }
    }

    for (const [id, asset] of toAssets.entries()) {
      const previous = fromAssets.get(id);

      if (!previous) {
        entries.push({
          path: `assets.${id}`,
          changeType: "added",
          after: asset
        });
        continue;
      }

      if (JSON.stringify(previous) !== JSON.stringify(asset)) {
        entries.push({
          path: `assets.${id}`,
          changeType: "modified",
          before: previous,
          after: asset
        });

        if (previous.version !== asset.version) {
          breakingChanges.push(
            `Asset version changed: ${id} ${previous.version} -> ${asset.version}`
          );
        }

        const removedContracts =
          previous.contracts.filter(
            (contract) =>
              !asset.contracts.includes(contract)
          );

        for (const contract of removedContracts) {
          breakingChanges.push(
            `Contract removed from ${id}: ${contract}`
          );
        }
      }
    }

    const result: BlueprintDiffResult = {
      id: `blueprint-diff:${Date.now()}`,
      blueprintId: input.blueprintId,
      fromVersion: input.fromVersion,
      toVersion: input.toVersion,
      entries,
      breakingChanges,
      createdAt: new Date().toISOString()
    };

    this.audit.record({
      correlationId: input.correlationId,
      category: "diff",
      action: "blueprint-diff-calculated",
      subjectId: result.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        breakingChanges.length > 0
          ? "warning"
          : "success",
      metadata: {
        entries: entries.length,
        breakingChanges
      }
    });

    return result;
  }
}

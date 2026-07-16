import { createHash } from "crypto";
import {
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  LivingBlueprint,
  LivingBlueprintAsset
} from "../foundation-pack-10.types";
import { ArchitectureAuditService } from "../observability/architecture-audit.service";

@Injectable()
export class LivingBlueprintRegistryService {
  private readonly blueprints =
    new Map<string, LivingBlueprint>();

  constructor(
    private readonly audit: ArchitectureAuditService
  ) {}

  list() {
    return Array.from(this.blueprints.values());
  }

  get(id: string) {
    const blueprint = this.blueprints.get(id);

    if (!blueprint) {
      throw new NotFoundException(
        `Living blueprint not found: ${id}`
      );
    }

    return blueprint;
  }

  register(input: {
    id?: string;
    name: string;
    description: string;
    version: string;
    architectureDomain: string;
    ownerIdentityId: string;
    sourceOfTruth?: boolean;
    assets?: LivingBlueprintAsset[];
    tags?: string[];
    correlationId: string;
    actorIdentityId: string;
  }) {
    const now = new Date().toISOString();

    const draft: Omit<LivingBlueprint, "checksum"> = {
      id:
        input.id ??
        `living-blueprint:${this.slug(input.name)}`,
      name: input.name.trim(),
      description: input.description.trim(),
      version: input.version,
      status: "draft",
      architectureDomain: input.architectureDomain,
      ownerIdentityId: input.ownerIdentityId,
      sourceOfTruth: input.sourceOfTruth ?? true,
      assets: this.normalizeAssets(input.assets ?? []),
      tags: Array.from(new Set(input.tags ?? [])),
      createdAt: now,
      updatedAt: now
    };

    const blueprint: LivingBlueprint = {
      ...draft,
      checksum: this.checksum(draft)
    };

    this.blueprints.set(blueprint.id, blueprint);

    this.audit.record({
      correlationId: input.correlationId,
      category: "blueprint",
      action: "blueprint-registered",
      subjectId: blueprint.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        version: blueprint.version,
        assets: blueprint.assets.length,
        sourceOfTruth: blueprint.sourceOfTruth
      }
    });

    return blueprint;
  }

  update(
    id: string,
    patch: {
      description?: string;
      version?: string;
      status?: LivingBlueprint["status"];
      sourceOfTruth?: boolean;
      assets?: LivingBlueprintAsset[];
      tags?: string[];
    },
    context: {
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    const current = this.get(id);

    const draft: Omit<LivingBlueprint, "checksum"> = {
      ...current,
      ...patch,
      assets:
        patch.assets === undefined
          ? current.assets
          : this.normalizeAssets(patch.assets),
      tags:
        patch.tags === undefined
          ? current.tags
          : Array.from(new Set(patch.tags)),
      updatedAt: new Date().toISOString()
    };

    const updated: LivingBlueprint = {
      ...draft,
      checksum: this.checksum(draft)
    };

    this.blueprints.set(id, updated);

    this.audit.record({
      correlationId: context.correlationId,
      category: "blueprint",
      action: "blueprint-updated",
      subjectId: id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        version: updated.version,
        assets: updated.assets.length
      }
    });

    return updated;
  }

  addAsset(
    blueprintId: string,
    asset: LivingBlueprintAsset,
    context: {
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    const blueprint = this.get(blueprintId);

    const assets = blueprint.assets.filter(
      (item) => item.id !== asset.id
    );

    assets.push(asset);

    return this.update(
      blueprintId,
      { assets },
      context
    );
  }

  removeAsset(
    blueprintId: string,
    assetId: string,
    context: {
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    const blueprint = this.get(blueprintId);

    return this.update(
      blueprintId,
      {
        assets: blueprint.assets.filter(
          (asset) => asset.id !== assetId
        )
      },
      context
    );
  }

  summary() {
    const blueprints = this.list();

    return {
      total: blueprints.length,
      active: blueprints.filter(
        (blueprint) => blueprint.status === "active"
      ).length,
      sourceOfTruth: blueprints.filter(
        (blueprint) => blueprint.sourceOfTruth
      ).length,
      totalAssets: blueprints.reduce(
        (sum, blueprint) => sum + blueprint.assets.length,
        0
      )
    };
  }

  private normalizeAssets(
    assets: LivingBlueprintAsset[]
  ) {
    return assets.map((asset) => ({
      ...asset,
      dependencies: Array.from(
        new Set(asset.dependencies)
      ),
      contracts: Array.from(
        new Set(asset.contracts)
      ),
      policies: Array.from(
        new Set(asset.policies)
      )
    }));
  }

  private checksum(value: unknown) {
    return createHash("sha256")
      .update(JSON.stringify(value))
      .digest("hex");
  }

  private slug(value: string) {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
}

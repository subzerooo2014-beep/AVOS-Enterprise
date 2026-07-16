import {
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  BlueprintVersionRecord,
  LivingBlueprint
} from "../foundation-pack-10.types";
import { LivingBlueprintRegistryService } from "../blueprints/living-blueprint-registry.service";
import { ArchitectureAuditService } from "../observability/architecture-audit.service";

@Injectable()
export class BlueprintVersionManagerService {
  private readonly versions =
    new Map<string, BlueprintVersionRecord>();

  constructor(
    private readonly blueprints: LivingBlueprintRegistryService,
    private readonly audit: ArchitectureAuditService
  ) {}

  list() {
    return Array.from(this.versions.values());
  }

  get(id: string) {
    const record = this.versions.get(id);

    if (!record) {
      throw new NotFoundException(
        `Blueprint version record not found: ${id}`
      );
    }

    return record;
  }

  byBlueprint(blueprintId: string) {
    return this.list()
      .filter(
        (record) => record.blueprintId === blueprintId
      )
      .sort((left, right) =>
        left.createdAt.localeCompare(right.createdAt)
      );
  }

  snapshot(input: {
    blueprintId: string;
    changeSummary: string;
    changedByIdentityId: string;
    correlationId: string;
  }) {
    const blueprint = this.blueprints.get(input.blueprintId);
    const existing = this.byBlueprint(blueprint.id);
    const previousVersion =
      existing.length === 0
        ? undefined
        : existing[existing.length - 1]?.version;

    const snapshot: LivingBlueprint =
      JSON.parse(JSON.stringify(blueprint)) as LivingBlueprint;

    const record: BlueprintVersionRecord = {
      id: `blueprint-version:${blueprint.id}:${blueprint.version}`,
      blueprintId: blueprint.id,
      version: blueprint.version,
      previousVersion,
      snapshot,
      changeSummary: input.changeSummary,
      changedByIdentityId: input.changedByIdentityId,
      createdAt: new Date().toISOString()
    };

    this.versions.set(record.id, record);

    this.audit.record({
      correlationId: input.correlationId,
      category: "version",
      action: "blueprint-version-snapshotted",
      subjectId: record.id,
      actorIdentityId: input.changedByIdentityId,
      outcome: "success",
      metadata: {
        blueprintId: blueprint.id,
        version: blueprint.version,
        previousVersion
      }
    });

    return record;
  }

  getByVersion(
    blueprintId: string,
    version: string
  ) {
    const record = this.byBlueprint(blueprintId).find(
      (item) => item.version === version
    );

    if (!record) {
      throw new NotFoundException(
        `Blueprint ${blueprintId} version ${version} not found.`
      );
    }

    return record;
  }

  restore(input: {
    blueprintId: string;
    version: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const record = this.getByVersion(
      input.blueprintId,
      input.version
    );

    return this.blueprints.update(
      input.blueprintId,
      {
        description: record.snapshot.description,
        version: record.snapshot.version,
        status: record.snapshot.status,
        sourceOfTruth: record.snapshot.sourceOfTruth,
        assets: record.snapshot.assets,
        tags: record.snapshot.tags
      },
      {
        correlationId: input.correlationId,
        actorIdentityId: input.actorIdentityId
      }
    );
  }

  summary() {
    return {
      total: this.versions.size,
      blueprintsVersioned: new Set(
        this.list().map((record) => record.blueprintId)
      ).size
    };
  }
}

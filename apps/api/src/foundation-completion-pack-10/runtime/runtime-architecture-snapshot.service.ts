import { createHash } from "crypto";
import { Injectable } from "@nestjs/common";
import {
  LivingBlueprintAsset,
  RuntimeArchitectureSnapshot
} from "../foundation-pack-10.types";
import { ArchitectureAuditService } from "../observability/architecture-audit.service";

@Injectable()
export class RuntimeArchitectureSnapshotService {
  private readonly snapshots =
    new Map<string, RuntimeArchitectureSnapshot>();

  constructor(
    private readonly audit: ArchitectureAuditService
  ) {}

  list() {
    return Array.from(this.snapshots.values());
  }

  get(id: string) {
    const snapshot = this.snapshots.get(id);

    if (!snapshot) {
      throw new Error(
        `Runtime architecture snapshot not found: ${id}`
      );
    }

    return snapshot;
  }

  capture(input: {
    environment: string;
    capturedByIdentityId: string;
    assets: LivingBlueprintAsset[];
    metadata?: Record<string, unknown>;
    correlationId: string;
  }) {
    const normalized = input.assets.map((asset) => ({
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

    const checksum = createHash("sha256")
      .update(JSON.stringify(normalized))
      .digest("hex");

    const snapshot: RuntimeArchitectureSnapshot = {
      id: `runtime-architecture:${Date.now()}:${
        this.snapshots.size + 1
      }`,
      environment: input.environment,
      capturedByIdentityId: input.capturedByIdentityId,
      assets: normalized,
      checksum,
      metadata: input.metadata ?? {},
      capturedAt: new Date().toISOString()
    };

    this.snapshots.set(snapshot.id, snapshot);

    this.audit.record({
      correlationId: input.correlationId,
      category: "runtime",
      action: "runtime-snapshot-captured",
      subjectId: snapshot.id,
      actorIdentityId: input.capturedByIdentityId,
      outcome: "success",
      metadata: {
        environment: snapshot.environment,
        assets: snapshot.assets.length
      }
    });

    return snapshot;
  }

  latest(environment?: string) {
    const snapshots = this.list()
      .filter(
        (snapshot) =>
          !environment ||
          snapshot.environment === environment
      )
      .sort((left, right) =>
        right.capturedAt.localeCompare(left.capturedAt)
      );

    return snapshots[0];
  }

  summary() {
    return {
      total: this.snapshots.size,
      environments: new Set(
        this.list().map(
          (snapshot) => snapshot.environment
        )
      ).size
    };
  }
}

import {
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  KernelConfigurationSnapshot
} from "../enterprise-kernel-mega-pack-2.types";
import { KernelConfigurationRegistryService } from "./kernel-configuration-registry.service";
import { KernelEnvironmentProfileService } from "../profiles/kernel-environment-profile.service";
import { KernelDependencyConfigurationAuditService } from "../observability/kernel-dependency-configuration-audit.service";

@Injectable()
export class KernelConfigurationSnapshotService {
  private readonly snapshots =
    new Map<string, KernelConfigurationSnapshot>();

  constructor(
    private readonly registry: KernelConfigurationRegistryService,
    private readonly profiles: KernelEnvironmentProfileService,
    private readonly audit: KernelDependencyConfigurationAuditService
  ) {}

  list() {
    return Array.from(this.snapshots.values());
  }

  get(id: string) {
    const snapshot = this.snapshots.get(id);

    if (!snapshot) {
      throw new NotFoundException(
        `Kernel configuration snapshot not found: ${id}`
      );
    }

    return snapshot;
  }

  create(input: {
    profileId: string;
    createdByIdentityId: string;
    correlationId: string;
    reason: string;
  }) {
    const profile =
      this.profiles.get(input.profileId);

    const resolved =
      this.registry.resolveProfile(
        profile.id
      );

    const snapshot: KernelConfigurationSnapshot = {
      id: `kernel-config-snapshot:${Date.now()}:${
        this.snapshots.size + 1
      }`,
      profileId: profile.id,
      environment:
        profile.environment,
      entries: JSON.parse(
        JSON.stringify(
          resolved.entries
        )
      ),
      createdByIdentityId:
        input.createdByIdentityId,
      correlationId:
        input.correlationId,
      reason: input.reason,
      createdAt: new Date().toISOString()
    };

    this.snapshots.set(
      snapshot.id,
      snapshot
    );

    this.audit.record({
      correlationId: input.correlationId,
      category: "configuration",
      action: "kernel-configuration-snapshot-created",
      subjectId: snapshot.id,
      actorIdentityId:
        input.createdByIdentityId,
      outcome: "success",
      metadata: {
        profileId: snapshot.profileId,
        environment:
          snapshot.environment,
        entries: snapshot.entries.length
      }
    });

    return snapshot;
  }

  restore(input: {
    snapshotId: string;
    actorIdentityId: string;
    correlationId: string;
    reason: string;
  }) {
    const snapshot = this.get(
      input.snapshotId
    );

    const restored = [];

    for (const snapshotEntry of snapshot.entries) {
      const current = this.registry
        .list()
        .find(
          (entry) =>
            entry.id ===
            snapshotEntry.id
        );

      if (!current) {
        continue;
      }

      restored.push(
        this.registry.restoreValue(
          current.id,
          snapshotEntry.value,
          {
            actorIdentityId:
              input.actorIdentityId,
            correlationId:
              input.correlationId,
            reason: input.reason
          }
        )
      );
    }

    this.audit.record({
      correlationId: input.correlationId,
      category: "configuration",
      action: "kernel-configuration-snapshot-restored",
      subjectId: snapshot.id,
      actorIdentityId:
        input.actorIdentityId,
      outcome: "success",
      metadata: {
        restoredEntries:
          restored.length
      }
    });

    return {
      snapshotId: snapshot.id,
      restoredEntries:
        restored.length,
      entries: restored
    };
  }

  summary() {
    return {
      total: this.snapshots.size,
      profilesSnapshotted: new Set(
        this.list().map(
          (snapshot) =>
            snapshot.profileId
        )
      ).size
    };
  }
}

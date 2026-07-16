import { Injectable } from "@nestjs/common";
import {
  KernelConfigurationVersion
} from "../enterprise-kernel-mega-pack-2.types";
import { KernelDependencyConfigurationAuditService } from "../observability/kernel-dependency-configuration-audit.service";

@Injectable()
export class KernelConfigurationVersionService {
  private readonly versions:
    KernelConfigurationVersion[] = [];

  constructor(
    private readonly audit: KernelDependencyConfigurationAuditService
  ) {}

  record(input: {
    entryId: string;
    version: number;
    previousValue: unknown;
    nextValue: unknown;
    changedByIdentityId: string;
    correlationId: string;
    reason: string;
  }) {
    const version: KernelConfigurationVersion = {
      id: `kernel-config-version:${Date.now()}:${
        this.versions.length + 1
      }`,
      entryId: input.entryId,
      version: input.version,
      previousValue: input.previousValue,
      nextValue: input.nextValue,
      changedByIdentityId:
        input.changedByIdentityId,
      correlationId: input.correlationId,
      reason: input.reason,
      createdAt: new Date().toISOString()
    };

    this.versions.push(version);

    this.audit.record({
      correlationId: input.correlationId,
      category: "version",
      action: "kernel-configuration-version-recorded",
      subjectId: version.id,
      actorIdentityId:
        input.changedByIdentityId,
      outcome: "success",
      metadata: {
        entryId: input.entryId,
        version: input.version
      }
    });

    return version;
  }

  list() {
    return [...this.versions];
  }

  byEntry(entryId: string) {
    return this.versions.filter(
      (version) =>
        version.entryId === entryId
    );
  }

  getVersion(
    entryId: string,
    version: number
  ) {
    return this.versions.find(
      (item) =>
        item.entryId === entryId &&
        item.version === version
    );
  }

  summary() {
    return {
      total: this.versions.length,
      entriesVersioned: new Set(
        this.versions.map(
          (version) =>
            version.entryId
        )
      ).size
    };
  }
}

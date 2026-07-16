import {
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  EnterpriseMemoryRecord,
  MemoryVersionRecord
} from "../foundation-pack-12.types";
import { EnterpriseMemoryRegistryService } from "../memory/enterprise-memory-registry.service";
import { MemoryAuditService } from "../observability/memory-audit.service";

@Injectable()
export class MemoryVersionManagerService {
  private readonly versions =
    new Map<string, MemoryVersionRecord>();

  constructor(
    private readonly memories: EnterpriseMemoryRegistryService,
    private readonly audit: MemoryAuditService
  ) {}

  list() {
    return Array.from(this.versions.values());
  }

  byMemory(memoryId: string) {
    return this.list()
      .filter(
        (version) => version.memoryId === memoryId
      )
      .sort((left, right) => left.version - right.version);
  }

  snapshot(input: {
    memoryId: string;
    changeSummary: string;
    changedByIdentityId: string;
    correlationId: string;
  }) {
    const memory = this.memories.get(input.memoryId);

    const snapshot =
      JSON.parse(JSON.stringify(memory)) as EnterpriseMemoryRecord;

    const record: MemoryVersionRecord = {
      id: `memory-version:${memory.id}:${memory.version}`,
      memoryId: memory.id,
      version: memory.version,
      snapshot,
      changeSummary: input.changeSummary,
      changedByIdentityId: input.changedByIdentityId,
      createdAt: new Date().toISOString()
    };

    this.versions.set(record.id, record);

    this.audit.record({
      correlationId: input.correlationId,
      category: "version",
      action: "memory-version-snapshotted",
      subjectId: record.id,
      actorIdentityId: input.changedByIdentityId,
      outcome: "success",
      metadata: {
        memoryId: memory.id,
        version: memory.version
      }
    });

    return record;
  }

  getVersion(
    memoryId: string,
    version: number
  ) {
    const record = this.byMemory(memoryId).find(
      (item) => item.version === version
    );

    if (!record) {
      throw new NotFoundException(
        `Memory ${memoryId} version ${version} not found.`
      );
    }

    return record;
  }

  summary() {
    return {
      total: this.versions.size,
      memoriesVersioned: new Set(
        this.list().map(
          (version) => version.memoryId
        )
      ).size
    };
  }
}

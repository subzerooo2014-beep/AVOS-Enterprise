import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PlatformAuditService } from "../../platform-control-plane/services/platform-audit.service";
import { PlatformRegistryService } from "../../platform-control-plane/services/platform-registry.service";
import {
  PlatformDependencyRecord,
  PlatformDependencyStatus,
  PlatformDependencyType
} from "../contracts/platform-dependency.contracts";
import { RegisterPlatformDependencyDto } from "../dto/register-platform-dependency.dto";
import { PlatformDependencyIdService } from "./platform-dependency-id.service";

@Injectable()
export class PlatformDependencyRegistryService {
  private readonly records = new Map<string, PlatformDependencyRecord>();

  constructor(
    private readonly ids: PlatformDependencyIdService,
    private readonly platformRegistry: PlatformRegistryService,
    private readonly audit: PlatformAuditService
  ) {}

  async register(
    dto: RegisterPlatformDependencyDto,
    actorId = "system"
  ): Promise<PlatformDependencyRecord> {
    if (dto.sourceServiceId === dto.targetServiceId) {
      throw new ConflictException("A service cannot depend on itself.");
    }

    this.platformRegistry.get(dto.sourceServiceId);
    this.platformRegistry.get(dto.targetServiceId);

    const duplicate = this.list().find(
      (item) =>
        item.sourceServiceId === dto.sourceServiceId &&
        item.targetServiceId === dto.targetServiceId &&
        item.type === (dto.type ?? "required")
    );

    if (duplicate) {
      throw new ConflictException(
        `Dependency already exists: ${dto.sourceServiceId} -> ${dto.targetServiceId}`
      );
    }

    const now = new Date().toISOString();
    const record: PlatformDependencyRecord = {
      id: this.ids.create("platform-dependency"),
      sourceServiceId: dto.sourceServiceId,
      targetServiceId: dto.targetServiceId,
      type: (dto.type ?? "required") as PlatformDependencyType,
      minimumVersion: dto.minimumVersion,
      status: (dto.status ?? "active") as PlatformDependencyStatus,
      metadata: dto.metadata,
      registeredAt: now,
      updatedAt: now
    };

    this.records.set(record.id, record);

    await this.audit.record({
      actorId,
      action: "platform.dependency.registered",
      resourceType: "platform-dependency",
      resourceId: record.id,
      outcome: "success",
      details: {
        sourceServiceId: record.sourceServiceId,
        targetServiceId: record.targetServiceId,
        type: record.type
      }
    });

    return record;
  }

  list(): PlatformDependencyRecord[] {
    return [...this.records.values()].sort((a, b) =>
      a.registeredAt.localeCompare(b.registeredAt)
    );
  }

  get(id: string): PlatformDependencyRecord {
    const record = this.records.get(id);
    if (!record) {
      throw new NotFoundException(`Platform dependency not found: ${id}`);
    }
    return record;
  }

  remove(id: string): PlatformDependencyRecord {
    const record = this.get(id);
    this.records.delete(id);
    return record;
  }

  dependenciesOf(serviceId: string): PlatformDependencyRecord[] {
    return this.list().filter(
      (item) => item.sourceServiceId === serviceId && item.status === "active"
    );
  }

  dependentsOf(serviceId: string): PlatformDependencyRecord[] {
    return this.list().filter(
      (item) => item.targetServiceId === serviceId && item.status === "active"
    );
  }
}

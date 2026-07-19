import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { RegisterPackageDto } from "../dto/register-package.dto";
import { PersistentFactoryRepository } from "../repositories/persistent-factory.repository";
import { GenerationPackageRecord } from "../types/persistence.types";
import { AuditTraceService } from "./audit-trace.service";
import { WorkspacePersistenceService } from "./workspace-persistence.service";

@Injectable()
export class PackageRegistryService {
  constructor(
    private readonly repository: PersistentFactoryRepository,
    private readonly workspaces: WorkspacePersistenceService,
    private readonly audit: AuditTraceService
  ) {}

  async register(
    workspaceId: string,
    dto: RegisterPackageDto
  ): Promise<GenerationPackageRecord> {
    this.workspaces.get(workspaceId);
    const now = new Date().toISOString();
    const record: GenerationPackageRecord = {
      id: `package:${Date.now()}:${randomUUID()}`,
      workspaceId,
      name: dto.name,
      version: dto.version,
      artifactIds: dto.artifactIds,
      status: "materialized",
      metadata: dto.metadata ?? {},
      createdAt: now,
      updatedAt: now
    };

    await this.repository.savePackage(record);
    await this.audit.record(
      "generation-package.registered",
      { packageId: record.id, name: record.name, version: record.version },
      workspaceId
    );

    return record;
  }
}
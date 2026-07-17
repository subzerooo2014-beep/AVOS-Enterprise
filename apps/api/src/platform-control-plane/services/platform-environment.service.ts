import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import type { PlatformEnvironment } from "../contracts/platform-control-plane.contracts";
import type { CreatePlatformEnvironmentDto } from "../dto/platform-control-plane.dto";
import { PlatformAuditService } from "./platform-audit.service";
import { PlatformIdService } from "./platform-id.service";

@Injectable()
export class PlatformEnvironmentService {
  private readonly environments = new Map<string, PlatformEnvironment>();

  constructor(
    private readonly ids: PlatformIdService,
    private readonly audit: PlatformAuditService
  ) {
    this.seed();
  }

  private seed(): void {
    const defaults: CreatePlatformEnvironmentDto[] = [
      {
        name: "AVOS Development",
        kind: "development",
        region: "local",
        isDefault: true,
        metadata: { managedBy: "platform-control-plane" }
      },
      {
        name: "AVOS Testing",
        kind: "testing",
        region: "local",
        metadata: { managedBy: "platform-control-plane" }
      },
      {
        name: "AVOS Staging",
        kind: "staging",
        region: "uae",
        metadata: { managedBy: "platform-control-plane" }
      },
      {
        name: "AVOS Production",
        kind: "production",
        region: "uae",
        metadata: { managedBy: "platform-control-plane" }
      }
    ];

    for (const dto of defaults) {
      this.create(dto, "system");
    }
  }

  create(dto: CreatePlatformEnvironmentDto, actorId: string): PlatformEnvironment {
    if (
      this.list().some(
        (environment) =>
          environment.name.toLowerCase() === dto.name.trim().toLowerCase()
      )
    ) {
      throw new ConflictException(`Environment already exists: ${dto.name}`);
    }

    const now = this.ids.now();
    const id = this.ids.create();

    if (dto.isDefault) {
      for (const existing of this.environments.values()) {
        this.environments.set(existing.id, {
          ...existing,
          isDefault: false,
          updatedAt: now
        });
      }
    }

    const environment: PlatformEnvironment = {
      id,
      name: dto.name.trim(),
      kind: dto.kind,
      region: dto.region.trim(),
      isDefault: dto.isDefault ?? false,
      status: "active",
      metadata: { ...(dto.metadata ?? {}) },
      createdAt: now,
      updatedAt: now
    };

    this.environments.set(id, environment);
    this.audit.record({
      action: "platform.environment.created",
      actorId,
      resourceType: "environment",
      resourceId: id,
      environmentId: id,
      outcome: "success",
      details: { name: environment.name, kind: environment.kind }
    });

    return environment;
  }

  list(): PlatformEnvironment[] {
    return [...this.environments.values()].sort((a, b) =>
      a.kind.localeCompare(b.kind)
    );
  }

  get(id: string): PlatformEnvironment {
    const environment = this.environments.get(id);
    if (!environment) {
      throw new NotFoundException(`Platform environment not found: ${id}`);
    }
    return environment;
  }

  findByKind(kind: PlatformEnvironment["kind"]): PlatformEnvironment | undefined {
    return this.list().find((environment) => environment.kind === kind);
  }
}
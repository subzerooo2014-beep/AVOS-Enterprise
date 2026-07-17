import { Injectable, NotFoundException } from "@nestjs/common";
import type { PlatformConfiguration } from "../contracts/platform-control-plane.contracts";
import type { SetPlatformConfigurationDto } from "../dto/platform-control-plane.dto";
import { PlatformAuditService } from "./platform-audit.service";
import { PlatformEnvironmentService } from "./platform-environment.service";
import { PlatformIdService } from "./platform-id.service";

@Injectable()
export class PlatformConfigurationService {
  private readonly entries = new Map<string, PlatformConfiguration>();

  constructor(
    private readonly ids: PlatformIdService,
    private readonly environments: PlatformEnvironmentService,
    private readonly audit: PlatformAuditService
  ) {}

  set(dto: SetPlatformConfigurationDto): PlatformConfiguration {
    this.environments.get(dto.environmentId);
    const compoundKey = this.compoundKey(
      dto.environmentId,
      dto.namespace,
      dto.key
    );
    const existing = this.entries.get(compoundKey);

    const entry: PlatformConfiguration = {
      id: existing?.id ?? this.ids.create(),
      namespace: dto.namespace.trim(),
      key: dto.key.trim(),
      value: dto.value,
      environmentId: dto.environmentId,
      sensitive: dto.sensitive ?? false,
      version: (existing?.version ?? 0) + 1,
      description: dto.description,
      updatedBy: dto.updatedBy,
      updatedAt: this.ids.now()
    };

    this.entries.set(compoundKey, entry);
    this.audit.record({
      action: existing
        ? "platform.configuration.updated"
        : "platform.configuration.created",
      actorId: dto.updatedBy,
      resourceType: "configuration",
      resourceId: entry.id,
      environmentId: entry.environmentId,
      outcome: "success",
      details: {
        namespace: entry.namespace,
        key: entry.key,
        version: entry.version,
        sensitive: entry.sensitive
      }
    });

    return this.mask(entry);
  }

  get(
    environmentId: string,
    namespace: string,
    key: string
  ): PlatformConfiguration {
    const entry = this.entries.get(
      this.compoundKey(environmentId, namespace, key)
    );

    if (!entry) {
      throw new NotFoundException(
        `Platform configuration not found: ${namespace}.${key}`
      );
    }

    return this.mask(entry);
  }

  list(environmentId?: string, namespace?: string): PlatformConfiguration[] {
    return [...this.entries.values()]
      .filter(
        (entry) => !environmentId || entry.environmentId === environmentId
      )
      .filter((entry) => !namespace || entry.namespace === namespace)
      .map((entry) => this.mask(entry))
      .sort((a, b) =>
        `${a.namespace}.${a.key}`.localeCompare(`${b.namespace}.${b.key}`)
      );
  }

  count(): number {
    return this.entries.size;
  }

  private compoundKey(
    environmentId: string,
    namespace: string,
    key: string
  ): string {
    return `${environmentId}:${namespace.trim()}:${key.trim()}`;
  }

  private mask(entry: PlatformConfiguration): PlatformConfiguration {
    return entry.sensitive
      ? { ...entry, value: "***MASKED***" }
      : { ...entry };
  }
}
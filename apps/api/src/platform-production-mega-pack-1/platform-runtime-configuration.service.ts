import { Injectable } from "@nestjs/common";
import { PlatformRuntimeConfiguration } from "./platform-production-mega-pack-1.types";
import { PlatformProductionFileStoreService } from "./platform-production-file-store.service";

@Injectable()
export class PlatformRuntimeConfigurationService {
  constructor(
    private readonly store: PlatformProductionFileStoreService,
  ) {}

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  create(
    input: Omit<PlatformRuntimeConfiguration, "id" | "createdAt" | "active">,
  ): PlatformRuntimeConfiguration {
    if (
      input.immutableKeys.length > 0 &&
      (!input.approvedBy || !input.approvedBy.startsWith("human:"))
    ) {
      throw new Error(
        "Immutable runtime configuration requires Human Final Authority.",
      );
    }

    const configuration: PlatformRuntimeConfiguration = {
      ...input,
      id: this.id("runtime-config"),
      active: false,
      createdAt: this.now(),
    };

    this.store.writeJson(
      `configurations/${configuration.id}.json`,
      configuration,
    );

    return configuration;
  }

  activate(id: string): PlatformRuntimeConfiguration {
    const configurations = this.list();
    const target = configurations.find((item) => item.id === id);

    if (!target) {
      throw new Error(`Runtime configuration not found: ${id}`);
    }

    for (const configuration of configurations) {
      if (
        configuration.environment === target.environment &&
        configuration.active
      ) {
        this.store.writeJson(`configurations/${configuration.id}.json`, {
          ...configuration,
          active: false,
        });
      }
    }

    const activated: PlatformRuntimeConfiguration = {
      ...target,
      active: true,
    };

    this.store.writeJson(`configurations/${activated.id}.json`, activated);
    this.store.writeJson(
      `configurations-active/${activated.environment}.json`,
      activated,
    );

    return activated;
  }

  list(): PlatformRuntimeConfiguration[] {
    return this.store.listJson<PlatformRuntimeConfiguration>("configurations");
  }

  active(environment: string): PlatformRuntimeConfiguration | null {
    return this.store.readJson<PlatformRuntimeConfiguration | null>(
      `configurations-active/${environment}.json`,
      null,
    );
  }
}
import { Injectable } from "@nestjs/common";
import { OperationsEnvironment } from "./platform-production-mega-pack-3.types";
import { OperationsFileStoreService } from "./operations-file-store.service";

@Injectable()
export class EnvironmentManagementService {
  constructor(
    private readonly store: OperationsFileStoreService,
  ) {
    this.seed();
  }

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  private seed(): void {
    if (this.list().length > 0) {
      return;
    }

    const environments: Array<
      Omit<OperationsEnvironment, "id" | "createdAt" | "updatedAt">
    > = [
      {
        key: "development",
        name: "Development",
        region: "global",
        protected: false,
        deploymentPolicy: "open",
        healthScore: 100,
      },
      {
        key: "test",
        name: "Test",
        region: "global",
        protected: false,
        deploymentPolicy: "open",
        healthScore: 100,
      },
      {
        key: "staging",
        name: "Staging",
        region: "global",
        protected: true,
        deploymentPolicy: "approval-required",
        healthScore: 100,
      },
      {
        key: "production",
        name: "Production",
        region: "global",
        protected: true,
        deploymentPolicy: "change-window-only",
        activeRelease: "PPI-MP2-1.0.0",
        healthScore: 100,
      },
    ];

    for (const environment of environments) {
      this.register(environment);
    }
  }

  register(
    input: Omit<OperationsEnvironment, "id" | "createdAt" | "updatedAt">,
  ): OperationsEnvironment {
    const existing = this.list().find((item) => item.key === input.key);

    if (existing) {
      return existing;
    }

    const timestamp = this.now();
    const record: OperationsEnvironment = {
      ...input,
      id: this.id("environment"),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.store.writeJson(`environments/${record.id}.json`, record);
    return record;
  }

  list(): OperationsEnvironment[] {
    return this.store.listJson<OperationsEnvironment>("environments");
  }

  get(key: OperationsEnvironment["key"]): OperationsEnvironment {
    const environment = this.list().find((item) => item.key === key);

    if (!environment) {
      throw new Error(`Environment not found: ${key}`);
    }

    return environment;
  }

  update(
    key: OperationsEnvironment["key"],
    patch: Partial<OperationsEnvironment>,
  ): OperationsEnvironment {
    const environment = this.get(key);
    const updated: OperationsEnvironment = {
      ...environment,
      ...patch,
      healthScore:
        patch.healthScore === undefined
          ? environment.healthScore
          : Math.max(0, Math.min(100, patch.healthScore)),
      updatedAt: this.now(),
    };

    this.store.writeJson(`environments/${updated.id}.json`, updated);
    return updated;
  }
}
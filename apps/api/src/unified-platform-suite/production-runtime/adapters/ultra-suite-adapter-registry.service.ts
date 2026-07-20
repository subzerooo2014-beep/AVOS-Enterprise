import { Injectable, OnModuleInit } from "@nestjs/common";
import { UltraSuiteAdapterContract } from "../contracts/production-runtime.types";
import { HttpUltraSuiteAdapter } from "./http-ultra-suite-adapter";
import { UltraSuiteHealthResult } from "../contracts/production-runtime.types";
import { ProductionPersistenceService } from "../persistence/production-persistence.service";

export interface UltraSuiteAdapterState {
  suiteId: string;
  suiteName: string;
  health: UltraSuiteHealthResult;
  capabilities: string[];
  refreshedAt: string;
}

@Injectable()
export class UltraSuiteAdapterRegistryService implements OnModuleInit {
  private readonly adapters = new Map<string, UltraSuiteAdapterContract>();

  constructor(
    private readonly persistence: ProductionPersistenceService
  ) {}

  async onModuleInit() {
    this.registerDefaults();
    await this.refreshAll();
  }

  register(adapter: UltraSuiteAdapterContract) {
    this.adapters.set(adapter.suiteId, adapter);

    return {
      suiteId: adapter.suiteId,
      suiteName: adapter.suiteName,
      version: adapter.version
    };
  }

  get(suiteId: string) {
    return this.adapters.get(suiteId) ?? null;
  }

  list() {
    return [...this.adapters.values()].map((adapter) => ({
      suiteId: adapter.suiteId,
      suiteName: adapter.suiteName,
      version: adapter.version
    }));
  }

  async health(suiteId: string): Promise<UltraSuiteHealthResult> {
    const adapter = this.adapters.get(suiteId);

    if (!adapter) {
      return {
        suiteId,
        suiteName: suiteId,
        connected: false,
        connectionState: "Disconnected",
        statusCode: null,
        latencyMs: 0,
        lastSuccessfulHealthCheck: null,
        checkedAt: new Date().toISOString(),
        endpoint: null,
        status: "not-registered",
        error: "Adapter is not registered"
      };
    }

    const health = await adapter.health();

    await this.persistence.upsert(
      "adapter-state",
      suiteId,
      {
        suiteId,
        suiteName: adapter.suiteName,
        health,
        refreshedAt: new Date().toISOString()
      }
    );

    return health;
  }

  async healthAll(): Promise<UltraSuiteHealthResult[]> {
    const results: UltraSuiteHealthResult[] = [];

    for (const suiteId of this.adapters.keys()) {
      results.push(await this.health(suiteId));
    }

    return results;
  }

  async refreshAll(): Promise<UltraSuiteAdapterState[]> {
    const results: UltraSuiteAdapterState[] = [];

    for (const adapter of this.adapters.values()) {
      const health = await adapter.health();
      const capabilities = await adapter.discoverCapabilities();

      const state: UltraSuiteAdapterState = {
        suiteId: adapter.suiteId,
        suiteName: adapter.suiteName,
        health,
        capabilities,
        refreshedAt: new Date().toISOString()
      };

      await this.persistence.upsert(
        "adapter-state",
        adapter.suiteId,
        state
      );

      results.push(state);
    }

    return results;
  }

  async execute(
    suiteId: string,
    action: string,
    payload: Record<string, unknown>
  ) {
    const adapter = this.adapters.get(suiteId);

    if (!adapter) {
      return {
        accepted: false,
        suiteId,
        action,
        reason: "adapter-not-registered"
      };
    }

    return adapter.execute(action, payload);
  }

  private registerDefaults() {
    const apiBase =
      process.env.AVOS_INTERNAL_API_BASE_URL ??
      "http://localhost:3000";

    const definitions = [
      {
        id: "marketplace",
        name: "AVOS Marketplace Ultra Suite",
        baseUrl: process.env.AVOS_MARKETPLACE_BASE_URL ?? apiBase,
        healthPath:
          process.env.AVOS_MARKETPLACE_HEALTH_PATH ??
          "/avos/marketplace-ultra/status"
      },
      {
        id: "media",
        name: "AVOS Media Ultra Suite",
        baseUrl: process.env.AVOS_MEDIA_BASE_URL ?? apiBase,
        healthPath:
          process.env.AVOS_MEDIA_HEALTH_PATH ??
          "/avos/media-ultra/status"
      },
      {
        id: "finance",
        name: "AVOS Finance Ultra Suite",
        baseUrl: process.env.AVOS_FINANCE_BASE_URL ?? apiBase,
        healthPath:
          process.env.AVOS_FINANCE_HEALTH_PATH ??
          "/avos/finance-ultra/status"
      },
      {
        id: "enterprise-brain",
        name: "AVOS Enterprise Brain Ultra Suite",
        baseUrl:
          process.env.AVOS_ENTERPRISE_BRAIN_BASE_URL ??
          apiBase,
        healthPath:
          process.env.AVOS_ENTERPRISE_BRAIN_HEALTH_PATH ??
          "/avos/enterprise-brain-ultra/status"
      },
      {
        id: "global-intelligence",
        name: "AVOS Global Intelligence Ultra Suite",
        baseUrl:
          process.env.AVOS_GLOBAL_INTELLIGENCE_BASE_URL ??
          apiBase,
        healthPath:
          process.env.AVOS_GLOBAL_INTELLIGENCE_HEALTH_PATH ??
          "/avos/global-intelligence-ultra/status"
      }
    ];

    for (const definition of definitions) {
      this.register(
        new HttpUltraSuiteAdapter({
          suiteId: definition.id,
          suiteName: definition.name,
          baseUrl: definition.baseUrl,
          healthPath: definition.healthPath,
          capabilitiesPath:
            `${definition.healthPath}/capabilities`,
          executePath:
            `${definition.healthPath}/execute`,
          timeoutMs: Number(
            process.env.AVOS_ULTRA_SUITE_HEALTH_TIMEOUT_MS ??
            5000
          )
        })
      );
    }
  }
}
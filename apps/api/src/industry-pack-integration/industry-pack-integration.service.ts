import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { UniversalIndustryCoreService } from "../universal-industry-core/universal-industry-core.service";
import {
  INDUSTRY_PACK_CATALOG,
  UNIVERSAL_CAPABILITY_MAPPING,
} from "./industry-pack-integration.registry";
import {
  IndustryCompatibilityResult,
  IndustryMigrationExecution,
  IndustryPackAdapter,
  IndustryPackDescriptor,
} from "./industry-pack-integration.types";

@Injectable()
export class IndustryPackIntegrationService {
  private readonly descriptors = new Map<string, IndustryPackDescriptor>();
  private readonly adapters = new Map<string, IndustryPackAdapter>();
  private readonly migrations = new Map<string, IndustryMigrationExecution>();

  constructor(private readonly universalCore: UniversalIndustryCoreService) {}

  catalog() {
    return {
      system: "AVOS Industry Pack Integration & Migration V1",
      packs: structuredClone(INDUSTRY_PACK_CATALOG),
      packCount: Object.keys(INDUSTRY_PACK_CATALOG).length,
      targetCore: this.universalCore.framework(),
    };
  }

  discoverPack(
    packCode: keyof typeof INDUSTRY_PACK_CATALOG,
    capabilities: string[],
  ) {
    const catalogEntry = INDUSTRY_PACK_CATALOG[packCode];

    if (!catalogEntry) {
      throw new Error(`Unknown industry pack: ${packCode}`);
    }

    const now = new Date().toISOString();
    const descriptor: IndustryPackDescriptor = {
      id: randomUUID(),
      code: catalogEntry.code,
      name: catalogEntry.name,
      sourceModule: catalogEntry.sourceModule,
      sourcePath: catalogEntry.sourcePath,
      industryCount: catalogEntry.industryCount,
      capabilities: [...new Set(capabilities)],
      version: catalogEntry.version,
      status: "DISCOVERED",
      compatibilityScore: 0,
      createdAt: now,
      updatedAt: now,
    };

    this.descriptors.set(descriptor.code, descriptor);
    return this.cloneDescriptor(descriptor);
  }

  recordCompatibility(
    packCode: string,
    result: IndustryCompatibilityResult,
  ) {
    const descriptor = this.requireDescriptor(packCode);

    descriptor.compatibilityScore = result.score;
    descriptor.status = result.score >= 70 ? "VALIDATED" : "FAILED";
    descriptor.updatedAt = new Date().toISOString();
    this.descriptors.set(packCode, descriptor);

    return {
      descriptor: this.cloneDescriptor(descriptor),
      result: {
        ...result,
        issues: [...result.issues],
      },
    };
  }

  createAdapter(packCode: string) {
    const descriptor = this.requireDescriptor(packCode);

    if (descriptor.status !== "VALIDATED") {
      throw new Error("Pack must pass compatibility validation first");
    }

    const mappings: Record<string, string> = {};

    for (const capability of descriptor.capabilities) {
      const mapped = UNIVERSAL_CAPABILITY_MAPPING[capability];

      if (mapped) {
        mappings[capability] = mapped;
      }
    }

    const now = new Date().toISOString();
    const adapter: IndustryPackAdapter = {
      id: randomUUID(),
      packCode,
      adapterType:
        descriptor.compatibilityScore >= 90
          ? "DIRECT"
          : descriptor.compatibilityScore >= 75
            ? "SHARED_RUNTIME"
            : "LEGACY_BRIDGE",
      sourceCapabilities: [...descriptor.capabilities],
      targetCapabilities: [...new Set(Object.values(mappings))],
      mappings,
      status: "DRAFT",
      createdAt: now,
      updatedAt: now,
    };

    this.adapters.set(packCode, adapter);
    return this.cloneAdapter(adapter);
  }

  activateAdapter(packCode: string) {
    const adapter = this.requireAdapter(packCode);
    adapter.status = "ACTIVE";
    adapter.updatedAt = new Date().toISOString();
    this.adapters.set(packCode, adapter);

    const descriptor = this.requireDescriptor(packCode);
    descriptor.status = "REGISTERED";
    descriptor.updatedAt = adapter.updatedAt;
    this.descriptors.set(packCode, descriptor);

    return this.cloneAdapter(adapter);
  }

  createMigration(packCode: string, targetCoreVersion = "1.0.0") {
    const descriptor = this.requireDescriptor(packCode);
    const adapter = this.requireAdapter(packCode);

    if (adapter.status !== "ACTIVE") {
      throw new Error("Adapter must be active before migration");
    }

    const now = new Date().toISOString();
    const migration: IndustryMigrationExecution = {
      id: randomUUID(),
      packCode,
      targetCoreVersion,
      status: "PENDING",
      migratedIndustries: 0,
      migratedCapabilities: 0,
      warnings: [],
      errors: [],
      createdAt: now,
      updatedAt: now,
    };

    if (adapter.targetCapabilities.length < descriptor.capabilities.length) {
      migration.warnings.push(
        "Some source capabilities require manual mapping review",
      );
    }

    this.migrations.set(migration.id, migration);
    return this.cloneMigration(migration);
  }

  executeMigration(id: string) {
    const migration = this.requireMigration(id);
    const descriptor = this.requireDescriptor(migration.packCode);
    const adapter = this.requireAdapter(migration.packCode);

    migration.status = "RUNNING";
    migration.startedAt = new Date().toISOString();
    migration.updatedAt = migration.startedAt;

    try {
      const registration = this.universalCore.registerIndustry({
        code: descriptor.code,
        name: descriptor.name,
        description: `Integrated industry pack from ${descriptor.sourcePath}`,
        version: descriptor.version,
        capabilities: adapter.targetCapabilities as never,
      });

      this.universalCore.activateIndustry(registration.id);

      migration.migratedIndustries = descriptor.industryCount;
      migration.migratedCapabilities = adapter.targetCapabilities.length;
      migration.status = "COMPLETED";
      migration.completedAt = new Date().toISOString();
      migration.updatedAt = migration.completedAt;

      descriptor.status = "MIGRATED";
      descriptor.updatedAt = migration.completedAt;
      this.descriptors.set(descriptor.code, descriptor);
    } catch (error) {
      migration.status = "FAILED";
      migration.errors.push(
        error instanceof Error ? error.message : "Unknown migration failure",
      );
      migration.completedAt = new Date().toISOString();
      migration.updatedAt = migration.completedAt;
    }

    this.migrations.set(id, migration);
    return this.cloneMigration(migration);
  }

  listPacks() {
    return Array.from(this.descriptors.values()).map((item) =>
      this.cloneDescriptor(item),
    );
  }

  listAdapters() {
    return Array.from(this.adapters.values()).map((item) =>
      this.cloneAdapter(item),
    );
  }

  listMigrations() {
    return Array.from(this.migrations.values()).map((item) =>
      this.cloneMigration(item),
    );
  }

  commandCenter() {
    const descriptors = Array.from(this.descriptors.values());
    const adapters = Array.from(this.adapters.values());
    const migrations = Array.from(this.migrations.values());

    return {
      system: "AVOS Industry Pack Integration & Migration V1",
      catalogPacks: Object.keys(INDUSTRY_PACK_CATALOG).length,
      discoveredPacks: descriptors.length,
      validatedPacks: descriptors.filter(
        (item) => item.status === "VALIDATED",
      ).length,
      registeredPacks: descriptors.filter(
        (item) => item.status === "REGISTERED",
      ).length,
      migratedPacks: descriptors.filter(
        (item) => item.status === "MIGRATED",
      ).length,
      activeAdapters: adapters.filter((item) => item.status === "ACTIVE").length,
      migrations: migrations.length,
      completedMigrations: migrations.filter(
        (item) => item.status === "COMPLETED",
      ).length,
      failedMigrations: migrations.filter(
        (item) => item.status === "FAILED",
      ).length,
      totalMigratedIndustries: migrations.reduce(
        (sum, item) => sum + item.migratedIndustries,
        0,
      ),
      generatedAt: new Date().toISOString(),
    };
  }

  private requireDescriptor(packCode: string) {
    const descriptor = this.descriptors.get(packCode);

    if (!descriptor) {
      throw new Error(`Industry pack is not discovered: ${packCode}`);
    }

    return descriptor;
  }

  private requireAdapter(packCode: string) {
    const adapter = this.adapters.get(packCode);

    if (!adapter) {
      throw new Error(`Industry pack adapter not found: ${packCode}`);
    }

    return adapter;
  }

  private requireMigration(id: string) {
    const migration = this.migrations.get(id);

    if (!migration) {
      throw new Error(`Migration execution not found: ${id}`);
    }

    return migration;
  }

  private cloneDescriptor(
    item: IndustryPackDescriptor,
  ): IndustryPackDescriptor {
    return {
      ...item,
      capabilities: [...item.capabilities],
    };
  }

  private cloneAdapter(item: IndustryPackAdapter): IndustryPackAdapter {
    return {
      ...item,
      sourceCapabilities: [...item.sourceCapabilities],
      targetCapabilities: [...item.targetCapabilities],
      mappings: { ...item.mappings },
    };
  }

  private cloneMigration(
    item: IndustryMigrationExecution,
  ): IndustryMigrationExecution {
    return {
      ...item,
      warnings: [...item.warnings],
      errors: [...item.errors],
    };
  }
}
import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  AVOS_ARCHITECTURE_STANDARDS,
  AVOS_REFERENCE_LAYERS,
  AVOS_REGISTRY_RULES,
} from "./reference-architecture.registry";
import {
  ArchitectureConformanceResult,
  ArchitectureRegistryEntry,
  RegistryKind,
} from "./reference-architecture.types";

@Injectable()
export class ReferenceArchitectureService {
  private readonly entries = new Map<
    string,
    ArchitectureRegistryEntry
  >();

  private readonly codeIndex = new Map<string, string>();

  getFramework() {
    return {
      system: "AVOS Reference Architecture & Registry Foundation",
      version: "1.0.0",
      status: "OFFICIAL",
      layers: [...AVOS_REFERENCE_LAYERS],
      standards: AVOS_ARCHITECTURE_STANDARDS.map((item) => ({
        ...item,
      })),
      registryRules: [...AVOS_REGISTRY_RULES],
      registryKinds: [
        "CAPABILITY",
        "PLATFORM",
        "INDUSTRY",
        "MODULE",
        "SERVICE",
        "API",
        "EVENT",
        "WORKFLOW",
      ] satisfies RegistryKind[],
    };
  }

  registerEntry(
    input: Omit<
      ArchitectureRegistryEntry,
      "id" | "status" | "createdAt" | "updatedAt"
    >,
  ): ArchitectureRegistryEntry {
    const code = input.code.trim().toUpperCase();

    if (!code) {
      throw new Error("Architecture registry code is required");
    }

    if (this.codeIndex.has(code)) {
      throw new Error(`Architecture registry code already exists: ${code}`);
    }

    if (!input.name.trim()) {
      throw new Error("Architecture registry name is required");
    }

    if (!input.owner.trim()) {
      throw new Error("Architecture owner is required");
    }

    if (!/^\d+\.\d+\.\d+$/.test(input.version)) {
      throw new Error("Version must use semantic version format");
    }

    const now = new Date().toISOString();

    const entry: ArchitectureRegistryEntry = {
      ...input,
      id: randomUUID(),
      code,
      name: input.name.trim(),
      owner: input.owner.trim(),
      dependencies: [...input.dependencies],
      capabilities: [...input.capabilities],
      apiRoutes: [...input.apiRoutes],
      eventNames: [...input.eventNames],
      status: "DRAFT",
      createdAt: now,
      updatedAt: now,
    };

    this.entries.set(entry.id, entry);
    this.codeIndex.set(code, entry.id);

    return this.cloneEntry(entry);
  }

  activateEntry(id: string): ArchitectureRegistryEntry {
    const result = this.evaluateEntry(id);

    if (!result.valid) {
      throw new Error(
        `Architecture entry cannot be activated: ${result.violations.join("; ")}`,
      );
    }

    const entry = this.requireEntry(id);
    entry.status = "ACTIVE";
    entry.updatedAt = new Date().toISOString();
    this.entries.set(id, entry);

    return this.cloneEntry(entry);
  }

  deprecateEntry(id: string): ArchitectureRegistryEntry {
    const entry = this.requireEntry(id);
    entry.status = "DEPRECATED";
    entry.updatedAt = new Date().toISOString();
    this.entries.set(id, entry);

    return this.cloneEntry(entry);
  }

  evaluateEntry(id: string): ArchitectureConformanceResult {
    const entry = this.requireEntry(id);

    const missingFields: string[] = [];

    if (!entry.code) missingFields.push("code");
    if (!entry.name) missingFields.push("name");
    if (!entry.version) missingFields.push("version");
    if (!entry.owner) missingFields.push("owner");
    if (!entry.description) missingFields.push("description");
    if (!entry.layer) missingFields.push("layer");

    const unknownDependencies = entry.dependencies.filter(
      (dependencyCode) => !this.codeIndex.has(dependencyCode.toUpperCase()),
    );

    const duplicateCodes = Array.from(this.entries.values())
      .filter(
        (item) =>
          item.id !== entry.id &&
          item.code === entry.code,
      )
      .map((item) => item.code);

    const violations: string[] = [];

    if (missingFields.length > 0) {
      violations.push(`Missing fields: ${missingFields.join(", ")}`);
    }

    if (unknownDependencies.length > 0) {
      violations.push(
        `Unknown dependencies: ${unknownDependencies.join(", ")}`,
      );
    }

    if (duplicateCodes.length > 0) {
      violations.push(`Duplicate codes: ${duplicateCodes.join(", ")}`);
    }

    if (!/^\d+\.\d+\.\d+$/.test(entry.version)) {
      violations.push("Invalid semantic version");
    }

    return {
      entryId: id,
      valid:
        missingFields.length === 0 &&
        unknownDependencies.length === 0 &&
        duplicateCodes.length === 0 &&
        violations.length === 0,
      missingFields,
      unknownDependencies,
      duplicateCodes,
      violations,
      evaluatedAt: new Date().toISOString(),
    };
  }

  resolveDependencyGraph(id: string) {
    const root = this.requireEntry(id);
    const visited = new Set<string>();
    const graph: Array<{
      code: string;
      name: string;
      dependencies: string[];
    }> = [];

    const walk = (entry: ArchitectureRegistryEntry) => {
      if (visited.has(entry.code)) {
        return;
      }

      visited.add(entry.code);
      graph.push({
        code: entry.code,
        name: entry.name,
        dependencies: [...entry.dependencies],
      });

      for (const dependencyCode of entry.dependencies) {
        const dependencyId = this.codeIndex.get(
          dependencyCode.toUpperCase(),
        );

        if (dependencyId) {
          walk(this.requireEntry(dependencyId));
        }
      }
    };

    walk(root);

    return {
      rootCode: root.code,
      nodes: graph,
      nodeCount: graph.length,
      resolvedAt: new Date().toISOString(),
    };
  }

  getEntry(id: string): ArchitectureRegistryEntry {
    return this.cloneEntry(this.requireEntry(id));
  }

  listEntries(filters?: {
    registryKind?: RegistryKind;
    status?: ArchitectureRegistryEntry["status"];
  }): ArchitectureRegistryEntry[] {
    return Array.from(this.entries.values())
      .filter(
        (item) =>
          !filters?.registryKind ||
          item.registryKind === filters.registryKind,
      )
      .filter(
        (item) =>
          !filters?.status ||
          item.status === filters.status,
      )
      .map((item) => this.cloneEntry(item));
  }

  getRegistrySummary() {
    const entries = Array.from(this.entries.values());

    return {
      totalEntries: entries.length,
      active: entries.filter((item) => item.status === "ACTIVE").length,
      draft: entries.filter((item) => item.status === "DRAFT").length,
      deprecated: entries.filter(
        (item) => item.status === "DEPRECATED",
      ).length,
      byKind: entries.reduce<Record<string, number>>(
        (summary, item) => {
          summary[item.registryKind] =
            (summary[item.registryKind] ?? 0) + 1;
          return summary;
        },
        {},
      ),
      generatedAt: new Date().toISOString(),
    };
  }

  private requireEntry(id: string): ArchitectureRegistryEntry {
    const entry = this.entries.get(id);

    if (!entry) {
      throw new Error(`Architecture registry entry not found: ${id}`);
    }

    return entry;
  }

  private cloneEntry(
    entry: ArchitectureRegistryEntry,
  ): ArchitectureRegistryEntry {
    return {
      ...entry,
      dependencies: [...entry.dependencies],
      capabilities: [...entry.capabilities],
      apiRoutes: [...entry.apiRoutes],
      eventNames: [...entry.eventNames],
    };
  }
}
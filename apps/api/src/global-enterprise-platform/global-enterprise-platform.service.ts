import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { GLOBAL_PLATFORM_CAPABILITIES } from "./global-enterprise-platform.registry";
import {
  GlobalPlatformCapability,
  GlobalPlatformEntry,
  GlobalPlatformExecution,
  GlobalPlatformHealth,
} from "./global-enterprise-platform.types";

@Injectable()
export class GlobalEnterprisePlatformService {
  private readonly entries = new Map<string, GlobalPlatformEntry>();
  private readonly executions = new Map<string, GlobalPlatformExecution>();
  private readonly health = new Map<GlobalPlatformCapability, GlobalPlatformHealth>();
  private readonly codeIndex = new Map<string, string>();

  framework() {
    return {
      system: "AVOS Global Enterprise Platform Pack V1",
      status: "READY",
      capabilityCount: Object.keys(GLOBAL_PLATFORM_CAPABILITIES).length,
      capabilities: structuredClone(GLOBAL_PLATFORM_CAPABILITIES),
    };
  }

  registerEntry(
    capability: GlobalPlatformCapability,
    input: Omit<
      GlobalPlatformEntry,
      "id" | "capability" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    const code = `${capability}:${input.code.trim().toUpperCase()}`;

    if (!GLOBAL_PLATFORM_CAPABILITIES[capability]) {
      throw new Error(`Unknown platform capability: ${capability}`);
    }

    if (!input.name.trim()) {
      throw new Error("Platform entry name is required");
    }

    if (this.codeIndex.has(code)) {
      throw new Error(`Duplicate platform entry code: ${code}`);
    }

    const now = new Date().toISOString();

    const entry: GlobalPlatformEntry = {
      ...input,
      id: randomUUID(),
      capability,
      code: input.code.trim().toUpperCase(),
      name: input.name.trim(),
      status: "DRAFT",
      configuration: { ...input.configuration },
      createdAt: now,
      updatedAt: now,
    };

    this.entries.set(entry.id, entry);
    this.codeIndex.set(code, entry.id);
    return this.cloneEntry(entry);
  }

  activateEntry(id: string) {
    const entry = this.requireEntry(id);
    entry.status = "ACTIVE";
    entry.updatedAt = new Date().toISOString();
    this.entries.set(id, entry);
    return this.cloneEntry(entry);
  }

  execute(
    capability: GlobalPlatformCapability,
    input: { entryId: string; operation: string },
  ) {
    const entry = this.requireEntry(input.entryId);

    if (entry.capability !== capability) {
      throw new Error("Entry capability does not match execution capability");
    }

    if (entry.status !== "ACTIVE") {
      throw new Error("Platform entry must be active before execution");
    }

    const now = new Date().toISOString();

    const execution: GlobalPlatformExecution = {
      id: randomUUID(),
      capability,
      entryId: entry.id,
      operation: input.operation.trim(),
      status: "COMPLETED",
      result: {
        success: true,
        capability,
        operation: input.operation.trim(),
      },
      startedAt: now,
      completedAt: now,
      createdAt: now,
      updatedAt: now,
    };

    this.executions.set(execution.id, execution);
    return this.cloneExecution(execution);
  }

  updateHealth(
    capability: GlobalPlatformCapability,
    input: Omit<GlobalPlatformHealth, "capability" | "checkedAt">,
  ) {
    if (input.score < 0 || input.score > 100) {
      throw new Error("Health score must be between 0 and 100");
    }

    const health: GlobalPlatformHealth = {
      ...input,
      capability,
      checkedAt: new Date().toISOString(),
    };

    this.health.set(capability, health);
    return { ...health };
  }

  listEntries(capability?: GlobalPlatformCapability, tenantId?: string) {
    return Array.from(this.entries.values())
      .filter((item) => !capability || item.capability === capability)
      .filter((item) => !tenantId || item.tenantId === tenantId)
      .map((item) => this.cloneEntry(item));
  }

  commandCenter() {
    const entries = Array.from(this.entries.values());
    const executions = Array.from(this.executions.values());
    const health = Array.from(this.health.values());

    return {
      system: "AVOS Global Enterprise Platform Pack V1",
      capabilities: Object.keys(GLOBAL_PLATFORM_CAPABILITIES).length,
      entries: entries.length,
      activeEntries: entries.filter((item) => item.status === "ACTIVE").length,
      executions: executions.length,
      completedExecutions: executions.filter(
        (item) => item.status === "COMPLETED",
      ).length,
      healthChecks: health.length,
      healthyCapabilities: health.filter(
        (item) => item.status === "HEALTHY",
      ).length,
      averageHealthScore:
        health.length === 0
          ? 0
          : Number(
              (
                health.reduce((sum, item) => sum + item.score, 0) /
                health.length
              ).toFixed(2),
            ),
      generatedAt: new Date().toISOString(),
    };
  }

  private requireEntry(id: string) {
    const entry = this.entries.get(id);
    if (!entry) throw new Error(`Platform entry not found: ${id}`);
    return entry;
  }

  private cloneEntry(entry: GlobalPlatformEntry): GlobalPlatformEntry {
    return { ...entry, configuration: { ...entry.configuration } };
  }

  private cloneExecution(
    execution: GlobalPlatformExecution,
  ): GlobalPlatformExecution {
    return {
      ...execution,
      result: execution.result ? { ...execution.result } : undefined,
    };
  }
}
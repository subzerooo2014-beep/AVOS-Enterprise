import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  CAPABILITY_RUNTIME_PILLARS,
  CAPABILITY_RUNTIME_TRANSITIONS,
  CAPABILITY_RUNTIME_VERSION,
} from "./capability-runtime.registry";
import { CapabilityRuntimeCacheService } from "./capability-runtime-cache.service";
import { CapabilityRuntimeLoaderService } from "./capability-runtime-loader.service";
import { CapabilityRuntimeObservabilityService } from "./capability-runtime-observability.service";
import {
  CapabilityRuntimeExecutionRequest,
  CapabilityRuntimeExecutionResult,
  CapabilityRuntimeInstance,
  CapabilityRuntimeLoadRequest,
  CapabilityRuntimeSnapshot,
  CapabilityRuntimeState,
} from "./capability-runtime.types";

@Injectable()
export class CapabilityRuntimeService {
  private readonly instances = new Map<string, CapabilityRuntimeInstance>();

  constructor(
    private readonly loader: CapabilityRuntimeLoaderService,
    private readonly observability: CapabilityRuntimeObservabilityService,
    private readonly cache: CapabilityRuntimeCacheService,
  ) {}

  framework() {
    return {
      success: true,
      system: "AVOS Capability Fabric",
      megaPack: "CF-2 Capability Runtime",
      version: CAPABILITY_RUNTIME_VERSION,
      architecturalPrinciple: "Foundation First",
      status: "OPERATIONAL",
      pillars: [...CAPABILITY_RUNTIME_PILLARS],
      runtimeInstances: this.instances.size,
      cache: this.cache.snapshot(),
    };
  }

  load(request: CapabilityRuntimeLoadRequest) {
    const existing = [...this.instances.values()].find(
      (instance) =>
        instance.capabilityKey === request.capabilityKey.toLowerCase() &&
        instance.tenantId === (request.tenantId?.trim() || "default") &&
        instance.environment ===
          (request.environment?.trim() || "production") &&
        instance.state !== "STOPPED",
    );

    if (existing) {
      return {
        success: false,
        reason: "RUNTIME_INSTANCE_ALREADY_EXISTS",
        instance: this.clone(existing),
      };
    }

    const result = this.loader.load(request);
    if (result.success && result.instance) {
      this.instances.set(result.instance.runtimeId, result.instance);
    }

    return {
      ...result,
      instance: result.instance ? this.clone(result.instance) : undefined,
    };
  }

  list(filters?: {
    capabilityKey?: string;
    tenantId?: string;
    state?: string;
  }) {
    let values = [...this.instances.values()];

    if (filters?.capabilityKey) {
      values = values.filter(
        (instance) =>
          instance.capabilityKey === filters.capabilityKey!.toLowerCase(),
      );
    }

    if (filters?.tenantId) {
      values = values.filter(
        (instance) => instance.tenantId === filters.tenantId,
      );
    }

    if (filters?.state) {
      values = values.filter((instance) => instance.state === filters.state);
    }

    return values.map((instance) => this.clone(instance));
  }

  get(runtimeId: string) {
    const instance = this.instances.get(runtimeId);
    return instance ? this.clone(instance) : null;
  }

  activate(runtimeId: string) {
    const instance = this.require(runtimeId);
    const transitioned = this.transition(instance, "ACTIVE");
    if (!transitioned.success) return transitioned;

    instance.activatedAt = new Date().toISOString();
    instance.health = this.observability.health(instance);
    instance.diagnostics.push(
      this.observability.diagnostic(
        "INFO",
        "RUNTIME_ACTIVATED",
        "Capability runtime was activated.",
      ),
    );

    return { success: true, instance: this.clone(instance) };
  }

  suspend(runtimeId: string, reason = "Administrative suspension") {
    const instance = this.require(runtimeId);
    const transitioned = this.transition(instance, "SUSPENDED");
    if (!transitioned.success) return transitioned;

    instance.suspendedAt = new Date().toISOString();
    instance.health = this.observability.health(instance);
    instance.diagnostics.push(
      this.observability.diagnostic(
        "WARNING",
        "RUNTIME_SUSPENDED",
        reason,
      ),
    );

    return { success: true, instance: this.clone(instance) };
  }

  restart(runtimeId: string) {
    const instance = this.require(runtimeId);

    if (instance.state === "STOPPED") {
      return { success: false, reason: "STOPPED_RUNTIME_CANNOT_RESTART" };
    }

    instance.state = "LOADING";
    instance.updatedAt = new Date().toISOString();
    instance.restartCount += 1;
    instance.state = "ACTIVE";
    instance.activatedAt = new Date().toISOString();
    instance.lastError = undefined;
    instance.health = this.observability.health(instance);
    instance.diagnostics.push(
      this.observability.diagnostic(
        "INFO",
        "RUNTIME_RESTARTED",
        "Capability runtime restarted successfully.",
        { restartCount: instance.restartCount },
      ),
    );

    return { success: true, instance: this.clone(instance) };
  }

  stop(runtimeId: string, reason = "Administrative stop") {
    const instance = this.require(runtimeId);
    const transitioned = this.transition(instance, "STOPPED");
    if (!transitioned.success) return transitioned;

    instance.stoppedAt = new Date().toISOString();
    instance.health = this.observability.health(instance);
    instance.diagnostics.push(
      this.observability.diagnostic(
        "INFO",
        "RUNTIME_STOPPED",
        reason,
      ),
    );
    this.cache.clearPrefix(`${runtimeId}:`);

    return { success: true, instance: this.clone(instance) };
  }

  checkHealth(runtimeId: string) {
    const instance = this.require(runtimeId);
    instance.health = this.observability.health(instance);
    instance.updatedAt = new Date().toISOString();

    return {
      success: true,
      runtimeId,
      health: structuredClone(instance.health),
    };
  }

  diagnostics(runtimeId: string) {
    return this.clone(this.require(runtimeId)).diagnostics;
  }

  async execute(
    request: CapabilityRuntimeExecutionRequest,
  ): Promise<CapabilityRuntimeExecutionResult> {
    const instance = this.require(request.runtimeId);
    const correlationId = request.correlationId ?? randomUUID();
    const startedAt = Date.now();

    if (instance.state === "READY" && instance.lazy) {
      const activation = this.activate(instance.runtimeId);
      if (!activation.success) {
        return {
          success: false,
          runtimeId: instance.runtimeId,
          operation: request.operation,
          correlationId,
          durationMs: Date.now() - startedAt,
          state: instance.state,
          error: "LAZY_ACTIVATION_FAILED",
        };
      }
    }

    if (instance.state !== "ACTIVE" && instance.state !== "DEGRADED") {
      return {
        success: false,
        runtimeId: instance.runtimeId,
        operation: request.operation,
        correlationId,
        durationMs: Date.now() - startedAt,
        state: instance.state,
        error: `RUNTIME_NOT_EXECUTABLE_${instance.state}`,
      };
    }

    if (instance.resources.activeExecutions >= 10) {
      instance.resources.queuedExecutions += 1;
      return {
        success: false,
        runtimeId: instance.runtimeId,
        operation: request.operation,
        correlationId,
        durationMs: Date.now() - startedAt,
        state: instance.state,
        error: "RUNTIME_CONCURRENCY_LIMIT",
      };
    }

    instance.resources.activeExecutions += 1;
    instance.resources.peakConcurrency = Math.max(
      instance.resources.peakConcurrency,
      instance.resources.activeExecutions,
    );
    instance.resources.totalExecutions += 1;

    try {
      const output = {
        accepted: true,
        capabilityKey: instance.capabilityKey,
        capabilityVersion: instance.capabilityVersion,
        operation: request.operation,
        payload: request.payload ?? null,
        isolation: instance.isolation,
        executedAt: new Date().toISOString(),
      };

      const durationMs = Date.now() - startedAt;
      const completed = instance.resources.totalExecutions;
      instance.resources.averageDurationMs =
        ((instance.resources.averageDurationMs * (completed - 1)) +
          durationMs) /
        completed;
      instance.updatedAt = new Date().toISOString();

      return {
        success: true,
        runtimeId: instance.runtimeId,
        operation: request.operation,
        correlationId,
        durationMs,
        state: instance.state,
        output,
      };
    } catch (error) {
      instance.failureCount += 1;
      instance.resources.failedExecutions += 1;
      instance.lastError =
        error instanceof Error ? error.message : "Unknown runtime failure";
      instance.state = "DEGRADED";
      instance.health = this.observability.health(instance);
      instance.diagnostics.push(
        this.observability.diagnostic(
          "ERROR",
          "RUNTIME_EXECUTION_FAILED",
          instance.lastError,
          { operation: request.operation, correlationId },
        ),
      );

      return {
        success: false,
        runtimeId: instance.runtimeId,
        operation: request.operation,
        correlationId,
        durationMs: Date.now() - startedAt,
        state: instance.state,
        error: instance.lastError,
      };
    } finally {
      instance.resources.activeExecutions = Math.max(
        0,
        instance.resources.activeExecutions - 1,
      );
    }
  }

  cacheSet(runtimeId: string, key: string, value: unknown, ttlMs?: number) {
    this.require(runtimeId);
    return this.cache.set(`${runtimeId}:${key}`, value, ttlMs);
  }

  cacheGet(runtimeId: string, key: string) {
    this.require(runtimeId);
    return this.cache.get(`${runtimeId}:${key}`);
  }

  snapshot(): CapabilityRuntimeSnapshot {
    const values = [...this.instances.values()];
    const totalExecutions = values.reduce(
      (total, instance) => total + instance.resources.totalExecutions,
      0,
    );
    const failedExecutions = values.reduce(
      (total, instance) => total + instance.resources.failedExecutions,
      0,
    );

    const countBy = (
      selector: (instance: CapabilityRuntimeInstance) => string,
    ) =>
      values.reduce<Record<string, number>>((result, instance) => {
        const key = selector(instance);
        result[key] = (result[key] ?? 0) + 1;
        return result;
      }, {});

    return {
      totalInstances: values.length,
      active: values.filter((instance) => instance.state === "ACTIVE").length,
      ready: values.filter((instance) => instance.state === "READY").length,
      degraded: values.filter((instance) => instance.state === "DEGRADED").length,
      suspended: values.filter((instance) => instance.state === "SUSPENDED").length,
      failed: values.filter((instance) => instance.state === "FAILED").length,
      stopped: values.filter((instance) => instance.state === "STOPPED").length,
      totalExecutions,
      failedExecutions,
      averageDurationMs:
        values.length === 0
          ? 0
          : values.reduce(
              (total, instance) =>
                total + instance.resources.averageDurationMs,
              0,
            ) / values.length,
      byIsolation: countBy((instance) => instance.isolation),
      byCapability: countBy((instance) => instance.capabilityKey),
      generatedAt: new Date().toISOString(),
    };
  }

  private transition(
    instance: CapabilityRuntimeInstance,
    target: CapabilityRuntimeState,
  ) {
    const allowed = CAPABILITY_RUNTIME_TRANSITIONS[instance.state];
    if (!allowed.includes(target)) {
      return {
        success: false,
        reason: "INVALID_RUNTIME_TRANSITION",
        current: instance.state,
        target,
        allowed,
      };
    }

    instance.state = target;
    instance.updatedAt = new Date().toISOString();

    return { success: true };
  }

  private require(runtimeId: string): CapabilityRuntimeInstance {
    const instance = this.instances.get(runtimeId);
    if (!instance) {
      throw new Error(`Capability runtime not found: ${runtimeId}`);
    }

    return instance;
  }

  private clone<T>(value: T): T {
    return structuredClone(value);
  }
}
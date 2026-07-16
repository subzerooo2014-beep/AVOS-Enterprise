import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { CapabilityRegistryService } from "../capability-fabric/capability-registry.service";
import { CapabilityRuntimeContextService } from "./capability-runtime-context.service";
import { CapabilityRuntimeResolverService } from "./capability-runtime-resolver.service";
import {
  CapabilityRuntimeInstance,
  CapabilityRuntimeLoadRequest,
} from "./capability-runtime.types";

@Injectable()
export class CapabilityRuntimeLoaderService {
  constructor(
    private readonly registry: CapabilityRegistryService,
    private readonly resolver: CapabilityRuntimeResolverService,
    private readonly contextFactory: CapabilityRuntimeContextService,
  ) {}

  load(request: CapabilityRuntimeLoadRequest): {
    success: boolean;
    instance?: CapabilityRuntimeInstance;
    reason?: string;
    resolution?: ReturnType<CapabilityRuntimeResolverService["resolve"]>;
  } {
    const resolution = this.resolver.resolve(request.capabilityKey);
    if (!resolution.success) {
      return {
        success: false,
        reason: resolution.reason,
        resolution,
      };
    }

    const capability = this.registry.get(request.capabilityKey);
    if (!capability) {
      return { success: false, reason: "CAPABILITY_NOT_REGISTERED" };
    }

    const runtimeId = randomUUID();
    const context = this.contextFactory.create(runtimeId, request);
    const now = new Date().toISOString();

    const instance: CapabilityRuntimeInstance = {
      runtimeId,
      capabilityKey: capability.identity.key,
      capabilityVersion: capability.version,
      state: request.lazy ? "READY" : "ACTIVE",
      tenantId: context.tenantId,
      environment: context.environment,
      isolation: context.isolation,
      lazy: request.lazy ?? false,
      loadedAt: now,
      activatedAt: request.lazy ? undefined : now,
      restartCount: 0,
      failureCount: 0,
      health: {
        status: request.lazy ? "UNKNOWN" : "HEALTHY",
        readiness: true,
        liveness: true,
        lastCheckedAt: request.lazy ? undefined : now,
        message: request.lazy
          ? "Runtime loaded lazily and awaiting activation."
          : "Runtime loaded and activated.",
      },
      resources: {
        activeExecutions: 0,
        queuedExecutions: 0,
        peakConcurrency: 0,
        totalExecutions: 0,
        failedExecutions: 0,
        averageDurationMs: 0,
        estimatedMemoryMb: Math.min(
          32,
          context.resourcePolicy.maxMemoryMb,
        ),
      },
      diagnostics: [
        {
          id: randomUUID(),
          level: "INFO",
          code: request.lazy ? "RUNTIME_LAZY_LOADED" : "RUNTIME_ACTIVATED",
          message: request.lazy
            ? "Capability runtime was loaded lazily."
            : "Capability runtime was loaded and activated.",
          recordedAt: now,
          metadata: {
            isolation: context.isolation,
            tenantId: context.tenantId,
            environment: context.environment,
            resolvedDependencies: resolution.resolvedDependencies,
          },
        },
      ],
      configuration: context.configuration,
      createdAt: now,
      updatedAt: now,
    };

    return { success: true, instance, resolution };
  }
}
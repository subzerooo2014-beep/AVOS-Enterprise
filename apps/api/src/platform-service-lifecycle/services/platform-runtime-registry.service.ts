import { Injectable, NotFoundException } from "@nestjs/common";
import type {
  RuntimeState,
  ServiceRuntimeRecord
} from "../contracts/platform-service-lifecycle.contracts";
import { PlatformRegistryService } from "../../platform-control-plane/services/platform-registry.service";
import { PlatformLifecycleIdService } from "./platform-lifecycle-id.service";

@Injectable()
export class PlatformRuntimeRegistryService {
  private readonly runtime = new Map<string, ServiceRuntimeRecord>();

  constructor(
    private readonly platformRegistry: PlatformRegistryService,
    private readonly ids: PlatformLifecycleIdService
  ) {}

  ensure(serviceId: string): ServiceRuntimeRecord {
    this.platformRegistry.get(serviceId);
    const existing = this.runtime.get(serviceId);
    if (existing) {
      return existing;
    }

    const created: ServiceRuntimeRecord = {
      serviceId,
      state: "registered",
      lastStateChangeAt: this.ids.now(),
      restartCount: 0,
      failureCount: 0,
      recoveryCount: 0,
      diagnostics: [],
      metadata: {}
    };

    this.runtime.set(serviceId, created);
    return created;
  }

  get(serviceId: string): ServiceRuntimeRecord {
    return this.runtime.get(serviceId) ?? this.ensure(serviceId);
  }

  list(): ServiceRuntimeRecord[] {
    for (const resource of this.platformRegistry.list()) {
      this.ensure(resource.id);
    }
    return [...this.runtime.values()].sort((a, b) =>
      a.serviceId.localeCompare(b.serviceId)
    );
  }

  update(
    serviceId: string,
    state: RuntimeState,
    patch: Partial<ServiceRuntimeRecord> = {}
  ): ServiceRuntimeRecord {
    const current = this.get(serviceId);
    const updated: ServiceRuntimeRecord = {
      ...current,
      ...patch,
      previousState: current.state,
      state,
      lastStateChangeAt: this.ids.now()
    };
    this.runtime.set(serviceId, updated);
    return updated;
  }

  requireState(serviceId: string, allowed: RuntimeState[]): ServiceRuntimeRecord {
    const current = this.get(serviceId);
    if (!allowed.includes(current.state)) {
      throw new NotFoundException(
        `Lifecycle transition is not allowed from state ${current.state}`
      );
    }
    return current;
  }
}
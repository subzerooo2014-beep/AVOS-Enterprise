import { Injectable } from "@nestjs/common";
import { RuntimeServiceRegistryV1Service } from "./runtime-service-registry-v1.service";
import type { RuntimeLifecycleEventV1 } from "./enterprise-runtime-platform-v1.types";

@Injectable()
export class RuntimeLifecycleManagerV1Service {
  private readonly events: RuntimeLifecycleEventV1[] = [];

  constructor(private readonly services: RuntimeServiceRegistryV1Service) {}

  transition(
    serviceId: string,
    toStatus: Parameters<RuntimeServiceRegistryV1Service["transition"]>[1],
    reason?: string,
  ): RuntimeLifecycleEventV1 {
    const before = this.services.get(serviceId);
    this.services.transition(serviceId, toStatus);

    const event: RuntimeLifecycleEventV1 = {
      id: `runtime-lifecycle-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      serviceId,
      transition: `${before.status}->${toStatus}`,
      fromStatus: before.status,
      toStatus,
      reason,
      createdAt: new Date().toISOString(),
    };

    this.events.unshift(event);
    return { ...event };
  }

  gracefulShutdown(serviceId: string): RuntimeLifecycleEventV1[] {
    return [
      this.transition(serviceId, "STOPPING", "Graceful shutdown initiated."),
      this.transition(serviceId, "STOPPED", "Graceful shutdown completed."),
    ];
  }

  list(): RuntimeLifecycleEventV1[] {
    return this.events.map((item) => ({ ...item }));
  }

  count(): number {
    return this.events.length;
  }
}

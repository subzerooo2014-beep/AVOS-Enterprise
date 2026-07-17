import { Injectable } from "@nestjs/common";
import type { ServiceHeartbeat } from "../contracts/platform-service-lifecycle.contracts";
import type { RecordHeartbeatDto } from "../dto/platform-service-lifecycle.dto";
import { PlatformLifecycleIdService } from "./platform-lifecycle-id.service";
import { PlatformRuntimeRegistryService } from "./platform-runtime-registry.service";

@Injectable()
export class PlatformHeartbeatService {
  private readonly heartbeats = new Map<string, ServiceHeartbeat[]>();

  constructor(
    private readonly ids: PlatformLifecycleIdService,
    private readonly runtime: PlatformRuntimeRegistryService
  ) {}

  record(serviceId: string, dto: RecordHeartbeatDto): ServiceHeartbeat {
    const current = this.runtime.get(serviceId);
    const heartbeat: ServiceHeartbeat = {
      id: this.ids.create(),
      serviceId,
      status: dto.status,
      latencyMs: dto.latencyMs,
      reportedAt: this.ids.now(),
      details: { ...(dto.details ?? {}) }
    };

    const list = this.heartbeats.get(serviceId) ?? [];
    list.push(heartbeat);
    this.heartbeats.set(serviceId, list.slice(-100));

    const targetState =
      dto.status === "healthy"
        ? current.state === "registered" || current.state === "degraded"
          ? "running"
          : current.state
        : dto.status === "degraded"
          ? "degraded"
          : "failed";

    this.runtime.update(serviceId, targetState, {
      lastHeartbeatAt: heartbeat.reportedAt
    });

    return heartbeat;
  }

  latest(serviceId: string): ServiceHeartbeat | undefined {
    const list = this.heartbeats.get(serviceId) ?? [];
    return list[list.length - 1];
  }

  list(serviceId: string, limit = 50): ServiceHeartbeat[] {
    const list = this.heartbeats.get(serviceId) ?? [];
    return list.slice().reverse().slice(0, Math.max(1, limit));
  }

  staleServices(maxAgeSeconds = 120): string[] {
    const threshold = Date.now() - maxAgeSeconds * 1000;
    return this.runtime
      .list()
      .filter((record) => {
        if (!record.lastHeartbeatAt) {
          return record.state === "running";
        }
        return new Date(record.lastHeartbeatAt).getTime() < threshold;
      })
      .map((record) => record.serviceId);
  }
}
import { Injectable } from "@nestjs/common";
import { UrpResourceSnapshot } from "./urp.contracts";
import { UrpRuntimeRegistryService } from "./urp-runtime-registry.service";

@Injectable()
export class UrpResourceManagerService {
  constructor(private readonly registry: UrpRuntimeRegistryService) {}

  snapshot(): UrpResourceSnapshot {
    const memory = process.memoryUsage();
    const runtime = this.registry.snapshot();

    return {
      timestamp: new Date().toISOString(),
      process: {
        pid: process.pid,
        uptimeSeconds: process.uptime(),
        memoryRssBytes: memory.rss,
        heapUsedBytes: memory.heapUsed,
        heapTotalBytes: memory.heapTotal,
      },
      runtime: {
        registeredUnits: runtime.total,
        operationalUnits: runtime.operational,
        degradedUnits: runtime.degraded,
        failedUnits: runtime.failed,
      },
    };
  }

  pressure() {
    const snapshot = this.snapshot();
    const heapRatio =
      snapshot.process.heapTotalBytes === 0
        ? 0
        : snapshot.process.heapUsedBytes / snapshot.process.heapTotalBytes;

    return {
      level: heapRatio > 0.9 ? "critical" : heapRatio > 0.75 ? "high" : "normal",
      heapRatio,
      snapshot,
    };
  }
}
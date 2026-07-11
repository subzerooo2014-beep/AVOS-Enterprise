import { Injectable } from "@nestjs/common";
import { RuntimeMetrics } from "../interfaces/runtime-metrics.interface";

@Injectable()
export class RuntimeMetricsService {
  async getMetrics(): Promise<RuntimeMetrics> {
    const memory = process.memoryUsage();
    const cpu = process.cpuUsage();
    const sampledDelayMs = await this.sampleEventLoopDelay();

    const heapUsagePercent =
      memory.heapTotal > 0
        ? (memory.heapUsed / memory.heapTotal) * 100
        : 0;

    return {
      timestamp: new Date().toISOString(),
      uptimeSeconds: Number(process.uptime().toFixed(3)),
      processId: process.pid,
      nodeVersion: process.version,
      platform: process.platform,
      architecture: process.arch,
      memory: {
        rssBytes: memory.rss,
        heapTotalBytes: memory.heapTotal,
        heapUsedBytes: memory.heapUsed,
        externalBytes: memory.external,
        arrayBuffersBytes: memory.arrayBuffers,
        heapUsagePercent: Number(heapUsagePercent.toFixed(2)),
      },
      cpu: {
        userMicroseconds: cpu.user,
        systemMicroseconds: cpu.system,
      },
      eventLoop: {
        sampledDelayMs,
        status: sampledDelayMs >= 250 ? "degraded" : "healthy",
      },
    };
  }

  private async sampleEventLoopDelay(): Promise<number> {
    const startedAt = process.hrtime.bigint();

    await new Promise<void>((resolve) => {
      setImmediate(resolve);
    });

    const elapsed =
      Number(process.hrtime.bigint() - startedAt) / 1_000_000;

    return Number(elapsed.toFixed(3));
  }
}

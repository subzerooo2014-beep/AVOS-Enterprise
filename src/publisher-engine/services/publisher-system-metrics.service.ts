import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherSystemMetricsService {
  metrics() {
    const memory = process.memoryUsage();

    return {
      pid: process.pid,
      uptime: process.uptime(),
      rss: memory.rss,
      heapUsed: memory.heapUsed,
      heapTotal: memory.heapTotal,
      external: memory.external,
      node: process.version,
      platform: process.platform,
      generatedAt: new Date(),
    };
  }
}

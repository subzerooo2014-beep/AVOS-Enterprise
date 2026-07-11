import { Injectable } from "@nestjs/common";

@Injectable()
export class MetricsService {
  snapshot() {
    return {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString(),
    };
  }
}

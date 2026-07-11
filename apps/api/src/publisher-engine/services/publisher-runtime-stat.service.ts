import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherRuntimeStatService {
  stats() {
    return {
      pid: process.pid,
      uptime: process.uptime(),
      cpu: process.cpuUsage(),
      platform: process.platform,
      node: process.version,
      generatedAt: new Date(),
    };
  }
}

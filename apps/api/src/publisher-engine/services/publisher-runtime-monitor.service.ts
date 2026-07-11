import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherRuntimeMonitorService {
  status() {
    return {
      pid: process.pid,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      generatedAt: new Date(),
    };
  }
}

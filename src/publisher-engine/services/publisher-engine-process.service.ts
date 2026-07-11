import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherEngineProcessService {
  info() {
    return {
      uptime: process.uptime(),
      cpu: process.cpuUsage(),
      memory: process.memoryUsage(),
      generatedAt: new Date(),
    };
  }
}

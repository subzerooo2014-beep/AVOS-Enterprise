import { Injectable } from "@nestjs/common";
import { PublisherVersionService } from "./publisher-version.service";

@Injectable()
export class PublisherEngineProfilerService {
  constructor(
    private readonly version: PublisherVersionService,
  ) {}

  profile() {
    return {
      engine: this.version.info(),
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      pid: process.pid,
      generatedAt: new Date(),
    };
  }
}

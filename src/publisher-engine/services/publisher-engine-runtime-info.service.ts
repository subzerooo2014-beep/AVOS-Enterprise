import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherEngineRuntimeInfoService {
  info() {
    return {
      pid: process.pid,
      node: process.version,
      platform: process.platform,
      uptime: process.uptime(),
      generatedAt: new Date(),
    };
  }
}

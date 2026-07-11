import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherEngineNodeService {
  info() {
    return {
      pid: process.pid,
      node: process.version,
      platform: process.platform,
      arch: process.arch,
    };
  }
}

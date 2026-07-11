import { Injectable } from "@nestjs/common";
import { PublisherRuntimeMonitorService } from "./publisher-runtime-monitor.service";
import { PublisherEngineStatusService } from "./publisher-engine-status.service";

@Injectable()
export class PublisherSystemRuntimeService {
  constructor(
    private readonly runtime: PublisherRuntimeMonitorService,
    private readonly status: PublisherEngineStatusService,
  ) {}

  info() {
    return {
      runtime: this.runtime.status(),
      status: this.status.status(),
      generatedAt: new Date(),
    };
  }
}

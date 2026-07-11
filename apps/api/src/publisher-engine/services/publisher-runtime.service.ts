import { Injectable } from "@nestjs/common";
import { PublisherEngineStatusService } from "./publisher-engine-status.service";
import { PublisherQueueMonitorService } from "./publisher-queue-monitor.service";

@Injectable()
export class PublisherRuntimeService {
  constructor(
    private readonly statusService: PublisherEngineStatusService,
    private readonly queueService: PublisherQueueMonitorService,
  ) {}

  async runtime() {
    return {
      status: this.statusService.status(),
      queue: await this.queueService.summary(),
      generatedAt: new Date(),
    };
  }
}

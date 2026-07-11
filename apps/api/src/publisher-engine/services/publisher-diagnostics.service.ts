import { Injectable } from "@nestjs/common";
import { PublisherHealthMonitorService } from "./publisher-health-monitor.service";
import { PublisherQueueMonitorService } from "./publisher-queue-monitor.service";

@Injectable()
export class PublisherDiagnosticsService {
  constructor(
    private readonly health: PublisherHealthMonitorService,
    private readonly queue: PublisherQueueMonitorService,
  ) {}

  async diagnostics() {
    return {
      success: true,
      health: await this.health.status(),
      queue: await this.queue.summary(),
      checkedAt: new Date(),
    };
  }
}

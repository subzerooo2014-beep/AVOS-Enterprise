import { Injectable } from "@nestjs/common";
import { PublisherRuntimeDashboardService } from "./publisher-runtime-dashboard.service";
import { PublisherQueueRuntimeService } from "./publisher-queue-runtime.service";

@Injectable()
export class PublisherEngineRuntimeV2Service {
  constructor(
    private readonly dashboard: PublisherRuntimeDashboardService,
    private readonly queue: PublisherQueueRuntimeService,
  ) {}

  async status() {
    return {
      success: true,
      dashboard: this.dashboard.dashboard(),
      queue: await this.queue.runtime(),
      generatedAt: new Date(),
    };
  }
}

import { Injectable } from "@nestjs/common";
import { PublisherQueueMonitorService } from "./publisher-queue-monitor.service";
import { PublisherPriorityQueueService } from "./publisher-priority-queue.service";

@Injectable()
export class PublisherQueueRuntimeService {
  constructor(
    private readonly monitor: PublisherQueueMonitorService,
    private readonly queue: PublisherPriorityQueueService,
  ) {}

  async runtime(limit = 20) {
    return {
      monitor: await this.monitor.summary(),
      queued: await this.queue.next(limit),
      generatedAt: new Date(),
    };
  }
}

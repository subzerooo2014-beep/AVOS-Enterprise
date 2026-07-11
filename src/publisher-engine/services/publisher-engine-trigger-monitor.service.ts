import { Injectable } from "@nestjs/common";
import { PublisherEngineTriggerHistoryService } from "./publisher-engine-trigger-history.service";

@Injectable()
export class PublisherEngineTriggerMonitorService {

  constructor(
    private readonly history: PublisherEngineTriggerHistoryService,
  ) {}

  monitor() {
    return {
      total: this.history.latest(5000).length,
      latest: this.history.latest(25),
      generatedAt: new Date(),
    };
  }
}

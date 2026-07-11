import { Injectable } from "@nestjs/common";
import { PublisherEngineTriggerService } from "./publisher-engine-trigger.service";
import { PublisherEngineTriggerHistoryService } from "./publisher-engine-trigger-history.service";

@Injectable()
export class PublisherEngineTriggerDispatcherService {

  constructor(
    private readonly trigger: PublisherEngineTriggerService,
    private readonly history: PublisherEngineTriggerHistoryService,
  ) {}

  dispatch(name: string, payload?: any) {
    const event = this.trigger.trigger(name, payload);
    return this.history.push(event);
  }
}

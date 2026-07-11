import { Injectable } from "@nestjs/common";
import { PublisherEngineTriggerDispatcherService } from "./publisher-engine-trigger-dispatcher.service";
import { PublisherEngineTaskDispatcherService } from "./publisher-engine-task-dispatcher.service";

@Injectable()
export class PublisherEngineOrchestratorService {

  constructor(
    private readonly trigger: PublisherEngineTriggerDispatcherService,
    private readonly tasks: PublisherEngineTaskDispatcherService,
  ) {}

  orchestrate(name: string, payload: any) {
    const event = this.trigger.dispatch(name, payload);
    const task = this.tasks.dispatch(name, payload);

    return {
      event,
      task,
      generatedAt: new Date(),
    };
  }
}

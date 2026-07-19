import { Injectable } from "@nestjs/common";
import { FactoryEvent } from "../contracts/event.contracts";
import { FactoryEventSubscriberService } from "./event-subscriber.service";

@Injectable()
export class FactoryEventDispatcherService {
  constructor(
    private readonly subscribers: FactoryEventSubscriberService,
  ) {}

  async dispatch(event: FactoryEvent): Promise<{
    eventId: string;
    delivered: number;
    failed: number;
  }> {
    const handlers = this.subscribers.handlersFor(event.type);
    let delivered = 0;
    let failed = 0;

    for (const handler of handlers) {
      try {
        await handler(event);
        delivered += 1;
      } catch {
        failed += 1;
      }
    }

    return {
      eventId: event.id,
      delivered,
      failed,
    };
  }
}

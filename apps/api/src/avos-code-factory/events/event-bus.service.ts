import { Injectable } from "@nestjs/common";
import { FactoryEvent, FactoryEventHandler } from "../contracts/event.contracts";
import { createFactoryId } from "../utils/factory-id.util";
import { FactoryEventDispatcherService } from "./event-dispatcher.service";
import { FactoryEventStoreService } from "./event-store.service";
import { FactoryEventSubscriberService } from "./event-subscriber.service";

@Injectable()
export class FactoryEventBusService {
  constructor(
    private readonly store: FactoryEventStoreService,
    private readonly dispatcher: FactoryEventDispatcherService,
    private readonly subscribers: FactoryEventSubscriberService,
  ) {}

  subscribe(type: string, handler: FactoryEventHandler): () => void {
    return this.subscribers.subscribe(type, handler);
  }

  async publish<TPayload extends Record<string, unknown>>(
    type: string,
    source: string,
    payload: TPayload,
    options: {
      subject?: string;
      metadata?: Record<string, unknown>;
    } = {},
  ) {
    const event: FactoryEvent<TPayload> = {
      id: createFactoryId("factory-event"),
      type,
      source,
      subject: options.subject,
      payload,
      metadata: options.metadata ?? {},
      occurredAt: new Date().toISOString(),
    };

    this.store.append(event);
    const delivery = await this.dispatcher.dispatch(event);

    return {
      event,
      delivery,
    };
  }

  history(limit = 100, type?: string) {
    return this.store.list(limit, type);
  }

  summary() {
    return {
      subscriptions: this.subscribers.summary(),
      recentEvents: this.store.list(20),
    };
  }
}

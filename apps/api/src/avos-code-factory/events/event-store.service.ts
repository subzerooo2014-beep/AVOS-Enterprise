import { Injectable } from "@nestjs/common";
import { FactoryEvent } from "../contracts/event.contracts";

@Injectable()
export class FactoryEventStoreService {
  private readonly events: FactoryEvent[] = [];

  append(event: FactoryEvent): FactoryEvent {
    this.events.unshift(event);
    if (this.events.length > 2_000) {
      this.events.length = 2_000;
    }
    return event;
  }

  list(limit = 100, type?: string): FactoryEvent[] {
    const filtered = type
      ? this.events.filter((event) => event.type === type)
      : this.events;

    return filtered.slice(0, Math.max(1, Math.min(limit, 500)));
  }

  get(id: string): FactoryEvent | undefined {
    return this.events.find((event) => event.id === id);
  }
}

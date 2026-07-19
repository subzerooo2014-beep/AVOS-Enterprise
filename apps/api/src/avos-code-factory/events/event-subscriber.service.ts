import { Injectable } from "@nestjs/common";
import { FactoryEventHandler } from "../contracts/event.contracts";

@Injectable()
export class FactoryEventSubscriberService {
  private readonly subscribers = new Map<string, Set<FactoryEventHandler>>();

  subscribe(type: string, handler: FactoryEventHandler): () => void {
    const handlers = this.subscribers.get(type) ?? new Set<FactoryEventHandler>();
    handlers.add(handler);
    this.subscribers.set(type, handlers);

    return () => {
      const current = this.subscribers.get(type);
      current?.delete(handler);
      if (current?.size === 0) {
        this.subscribers.delete(type);
      }
    };
  }

  handlersFor(type: string): FactoryEventHandler[] {
    return [
      ...(this.subscribers.get(type) ?? []),
      ...(this.subscribers.get("*") ?? []),
    ];
  }

  summary() {
    return [...this.subscribers.entries()].map(([type, handlers]) => ({
      type,
      handlers: handlers.size,
    }));
  }
}

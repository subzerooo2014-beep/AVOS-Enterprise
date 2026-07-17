import { Injectable } from '@nestjs/common';
import { RuntimeEvent } from '../contracts/runtime.contracts';
import { createRuntimeId, nowIso } from '../shared/runtime.utils';
import { RuntimeEventStoreService } from './runtime-event-store.service';

type EventHandler = (event: RuntimeEvent) => void | Promise<void>;

@Injectable()
export class RuntimeEventBusService {
  private readonly handlers = new Map<string, Set<EventHandler>>();

  constructor(private readonly store: RuntimeEventStoreService) {}

  publish<T>(
    event: Omit<RuntimeEvent<T>, 'id' | 'timestamp' | 'metadata'> & {
      metadata?: Record<string, unknown>;
    },
  ): RuntimeEvent<T> {
    const runtimeEvent: RuntimeEvent<T> = {
      id: createRuntimeId('evt'),
      timestamp: nowIso(),
      metadata: event.metadata ?? {},
      ...event,
    };

    this.store.append(runtimeEvent);

    const handlers = [
      ...(this.handlers.get(runtimeEvent.type) ?? []),
      ...(this.handlers.get('*') ?? []),
    ];

    for (const handler of handlers) {
      void Promise.resolve(handler(runtimeEvent));
    }

    return runtimeEvent;
  }

  subscribe(type: string, handler: EventHandler): () => void {
    const handlers = this.handlers.get(type) ?? new Set<EventHandler>();
    handlers.add(handler);
    this.handlers.set(type, handlers);

    return () => {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.handlers.delete(type);
      }
    };
  }

  subscriberCount(): number {
    return [...this.handlers.values()].reduce(
      (sum, handlers) => sum + handlers.size,
      0,
    );
  }
}
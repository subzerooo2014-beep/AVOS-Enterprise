import { Injectable } from '@nestjs/common';
import { RuntimeEvent } from '../contracts/runtime.contracts';
import { clone } from '../shared/runtime.utils';

@Injectable()
export class RuntimeEventStoreService {
  private readonly events: RuntimeEvent[] = [];

  append(event: RuntimeEvent): RuntimeEvent {
    this.events.push(clone(event));
    return clone(event);
  }

  list(type?: string): RuntimeEvent[] {
    const selected = type
      ? this.events.filter((event) => event.type === type)
      : this.events;
    return selected.map((event) => clone(event));
  }

  findByCorrelationId(correlationId: string): RuntimeEvent[] {
    return this.events
      .filter((event) => event.correlationId === correlationId)
      .map((event) => clone(event));
  }

  count(): number {
    return this.events.length;
  }

  clear(): void {
    this.events.length = 0;
  }
}
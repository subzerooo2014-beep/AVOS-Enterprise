import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CapabilityEvent } from '../domain/capability-runtime.types';
import { CapabilityEventRepository } from '../repositories/capability-event.repository';

@Injectable()
export class CapabilityEventBusService {
  constructor(
    private readonly events: CapabilityEventRepository,
  ) {}

  publish<T>(
    topic: string,
    source: string,
    payload: T,
  ): CapabilityEvent<T> {
    return this.events.append({
      id: randomUUID(),
      topic,
      source,
      payload,
      createdAt: new Date().toISOString(),
    }) as CapabilityEvent<T>;
  }

  list(topic?: string): CapabilityEvent[] {
    return this.events.list(topic);
  }
}
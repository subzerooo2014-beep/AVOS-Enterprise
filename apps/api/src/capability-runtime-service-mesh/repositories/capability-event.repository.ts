import { Injectable } from '@nestjs/common';
import { CapabilityEvent } from '../domain/capability-runtime.types';

@Injectable()
export class CapabilityEventRepository {
  private readonly events: CapabilityEvent[] = [];

  append(event: CapabilityEvent): CapabilityEvent {
    this.events.push(structuredClone(event));
    return structuredClone(event);
  }

  list(topic?: string): CapabilityEvent[] {
    return this.events
      .filter((event) => !topic || event.topic === topic)
      .map((event) => structuredClone(event));
  }
}
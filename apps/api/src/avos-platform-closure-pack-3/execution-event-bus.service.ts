import { Injectable } from '@nestjs/common';
import { ExecutionEvent } from './execution-runtime.types';

@Injectable()
export class ExecutionEventBusService {
  private readonly events: ExecutionEvent[] = [];

  publish(input: Omit<ExecutionEvent, 'id' | 'createdAt'>): ExecutionEvent {
    const event: ExecutionEvent = {
      id: `execution-event-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      ...input,
      createdAt: new Date().toISOString(),
    };

    this.events.push(event);
    return JSON.parse(JSON.stringify(event));
  }

  list(workflowId?: string): ExecutionEvent[] {
    return this.events
      .filter((event) => !workflowId || event.workflowId === workflowId)
      .map((event) => JSON.parse(JSON.stringify(event)));
  }
}
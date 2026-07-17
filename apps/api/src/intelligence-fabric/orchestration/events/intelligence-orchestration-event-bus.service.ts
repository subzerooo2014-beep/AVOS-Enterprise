import { Injectable } from "@nestjs/common";

export interface IntelligenceOrchestrationEvent {
  readonly id: string;
  readonly type: string;
  readonly correlationId: string;
  readonly payload: Readonly<Record<string, unknown>>;
  readonly emittedAt: string;
}

@Injectable()
export class IntelligenceOrchestrationEventBusService {
  private readonly events: IntelligenceOrchestrationEvent[] = [];

  emit(
    type: string,
    correlationId: string,
    payload: Readonly<Record<string, unknown>>,
  ): IntelligenceOrchestrationEvent {
    const event: IntelligenceOrchestrationEvent = {
      id: `if2-event:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`,
      type,
      correlationId,
      payload,
      emittedAt: new Date().toISOString(),
    };

    this.events.push(event);

    if (this.events.length > 500) {
      this.events.splice(0, this.events.length - 500);
    }

    return event;
  }

  list(limit = 50): readonly IntelligenceOrchestrationEvent[] {
    const normalizedLimit = Math.min(Math.max(limit, 1), 500);
    return this.events.slice(-normalizedLimit).reverse();
  }

  count(): number {
    return this.events.length;
  }
}
import { Injectable } from "@nestjs/common";

export interface KnowledgeExchangeEvent {
  id: number;
  type: string;
  payload: Record<string, unknown>;
  occurredAt: string;
}

@Injectable()
export class KnowledgeExchangeEventService {
  private readonly events: KnowledgeExchangeEvent[] = [];

  emit(type: string, payload: Record<string, unknown>): KnowledgeExchangeEvent {
    const event: KnowledgeExchangeEvent = { id: this.events.length + 1, type, payload, occurredAt: new Date().toISOString() };
    this.events.push(event);
    return event;
  }

  list(): KnowledgeExchangeEvent[] { return [...this.events]; }
  count(): number { return this.events.length; }
}
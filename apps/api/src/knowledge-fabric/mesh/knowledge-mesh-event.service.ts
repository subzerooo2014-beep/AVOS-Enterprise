import { Injectable } from "@nestjs/common";

export interface KnowledgeMeshEvent {
  id: number;
  type: string;
  payload: Record<string, unknown>;
  occurredAt: string;
}

@Injectable()
export class KnowledgeMeshEventService {
  private readonly events: KnowledgeMeshEvent[] = [];

  emit(type: string, payload: Record<string, unknown>): KnowledgeMeshEvent {
    const event: KnowledgeMeshEvent = { id: this.events.length + 1, type, payload, occurredAt: new Date().toISOString() };
    this.events.push(event);
    return event;
  }

  list(): KnowledgeMeshEvent[] { return [...this.events]; }
  count(): number { return this.events.length; }
}
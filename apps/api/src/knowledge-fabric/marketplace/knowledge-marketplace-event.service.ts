import { Injectable } from "@nestjs/common";

export interface KnowledgeMarketplaceEvent { id: string; type: string; aggregateId: string; payload: Record<string, unknown>; occurredAt: string; }

@Injectable()
export class KnowledgeMarketplaceEventService {
  private readonly events: KnowledgeMarketplaceEvent[] = [];
  emit(type: string, aggregateId: string, payload: Record<string, unknown> = {}): KnowledgeMarketplaceEvent {
    const event = { id: `${Date.now()}-${this.events.length + 1}`, type, aggregateId, payload, occurredAt: new Date().toISOString() };
    this.events.push(event);
    return structuredClone(event);
  }
  list(): KnowledgeMarketplaceEvent[] { return this.events.map((event) => structuredClone(event)); }
}
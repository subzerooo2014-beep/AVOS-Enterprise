import { Injectable } from "@nestjs/common";

@Injectable()
export class KnowledgeEconomyEventService {
  private readonly events: Array<{ name: string; payload: Record<string, unknown>; occurredAt: string }> = [];
  emit(name: string, payload: Record<string, unknown>) { const event = { name, payload, occurredAt: new Date().toISOString() }; this.events.push(event); return event; }
  list() { return this.events.map((event) => structuredClone(event)); }
}
import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { KnowledgeRuntimeEvent } from "./knowledge-runtime.types";

@Injectable()
export class KnowledgeRuntimeEventsService {
  private readonly events: KnowledgeRuntimeEvent[] = [];

  emit(type: string, payload: Record<string, unknown>, sessionId?: string, correlationId?: string): KnowledgeRuntimeEvent {
    const event: KnowledgeRuntimeEvent = {
      id: `kre_${randomUUID()}`,
      type,
      sessionId,
      correlationId,
      occurredAt: new Date().toISOString(),
      payload: structuredClone(payload),
    };
    this.events.push(event);
    if (this.events.length > 1_000) this.events.shift();
    return structuredClone(event);
  }

  list(limit = 100): KnowledgeRuntimeEvent[] {
    return this.events.slice(-Math.min(Math.max(limit, 1), 1_000)).map((event) => structuredClone(event));
  }
}

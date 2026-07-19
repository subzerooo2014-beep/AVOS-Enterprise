import { Injectable } from '@nestjs/common';

@Injectable()
export class FactoryAuditService {
  private readonly events: Record<string, unknown>[] = [];

  record(type: string, payload: Record<string, unknown>) {
    const event = {
      id: `factory-audit:${Date.now()}:${Math.random().toString(16).slice(2)}`,
      type,
      payload,
      recordedAt: new Date().toISOString(),
    };
    this.events.unshift(event);
    return event;
  }

  list() {
    return this.events.map((event) => structuredClone(event));
  }
}
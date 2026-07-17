import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { KnowledgeRevenueEvent } from "./knowledge-economy.types";

@Injectable()
export class KnowledgeRevenueLedgerService {
  private readonly events: KnowledgeRevenueEvent[] = [];

  record(input: Omit<KnowledgeRevenueEvent, "id" | "occurredAt">): KnowledgeRevenueEvent {
    const event: KnowledgeRevenueEvent = { ...input, id: randomUUID(), occurredAt: new Date().toISOString() };
    this.events.push(event);
    return structuredClone(event);
  }

  list(assetId?: string): KnowledgeRevenueEvent[] {
    return this.events.filter((event) => !assetId || event.assetId === assetId).map((event) => structuredClone(event));
  }

  total(assetId: string, period?: string): number {
    return Number(this.events.filter((event) => event.assetId === assetId && (!period || event.occurredAt.startsWith(period))).reduce((sum, event) => sum + event.grossAmount, 0).toFixed(2));
  }
}
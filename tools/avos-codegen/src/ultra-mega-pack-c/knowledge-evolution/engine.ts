import { randomUUID } from "node:crypto";
import {
  KnowledgeEvolutionRecord,
  KnowledgeEvolutionResult,
  KnowledgeEvolutionSignal,
} from "./contracts";

export class EnterpriseKnowledgeEvolutionEngine {
  private readonly records =
    new Map<string, KnowledgeEvolutionRecord>();

  evolve(
    signals: readonly KnowledgeEvolutionSignal[],
  ): KnowledgeEvolutionResult {
    let inserted = 0;
    let evolved = 0;
    let skipped = 0;
    const changed: KnowledgeEvolutionRecord[] = [];

    for (const signal of signals) {
      const key = `${signal.namespace}:${signal.topic}`;
      const existing = this.records.get(key);
      const now = new Date().toISOString();

      if (!existing) {
        const record: KnowledgeEvolutionRecord = {
          id: randomUUID(),
          namespace: signal.namespace,
          topic: signal.topic,
          facts: structuredClone(signal.facts),
          confidence: this.clamp(signal.confidence),
          generation: 1,
          createdAt: now,
          updatedAt: now,
        };

        this.records.set(key, record);
        changed.push(structuredClone(record));
        inserted += 1;
        continue;
      }

      const facts = {
        ...existing.facts,
        ...structuredClone(signal.facts),
      };

      const unchanged =
        JSON.stringify(facts) === JSON.stringify(existing.facts) &&
        existing.confidence === this.clamp(signal.confidence);

      if (unchanged) {
        skipped += 1;
        changed.push(structuredClone(existing));
        continue;
      }

      const record: KnowledgeEvolutionRecord = {
        ...existing,
        facts,
        confidence: Math.max(
          existing.confidence,
          this.clamp(signal.confidence),
        ),
        generation: existing.generation + 1,
        updatedAt: now,
      };

      this.records.set(key, record);
      changed.push(structuredClone(record));
      evolved += 1;
    }

    return {
      inserted,
      evolved,
      skipped,
      records: changed,
      evolvedAt: new Date().toISOString(),
    };
  }

  private clamp(value: number): number {
    return Math.max(0, Math.min(100, value));
  }
}

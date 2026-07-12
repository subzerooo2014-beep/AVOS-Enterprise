import { randomUUID } from "node:crypto";
import { UltraIValue } from "./contracts";

export interface OperationsMemoryEntry {
  id: string;
  key: string;
  event: string;
  decision: string;
  outcomeScore: number;
  lessons: string[];
  context: Record<string, UltraIValue>;
  createdAt: string;
}

export interface MemoryRecommendation {
  entryKey: string;
  similarityScore: number;
  recommendedDecision: string;
  expectedOutcomeScore: number;
}

export class CognitiveOperationsMemory {
  private readonly entries = new Map<string, OperationsMemoryEntry>();

  remember(
    input: Omit<OperationsMemoryEntry, "id" | "createdAt">,
  ): OperationsMemoryEntry {
    const entry: OperationsMemoryEntry = {
      ...structuredClone(input),
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };

    this.entries.set(entry.key, entry);
    return structuredClone(entry);
  }

  recommend(
    event: string,
    contextKeys: readonly string[],
  ): MemoryRecommendation | null {
    const candidates = Array.from(this.entries.values())
      .map((entry) => {
        const eventMatch = entry.event === event ? 70 : 20;
        const contextMatch =
          contextKeys.length === 0
            ? 30
            : Math.round(
                (contextKeys.filter((key) => key in entry.context).length /
                  contextKeys.length) *
                  30,
              );

        return {
          entry,
          similarityScore: Math.min(100, eventMatch + contextMatch),
        };
      })
      .sort((a, b) => b.similarityScore - a.similarityScore);

    const best = candidates[0];
    if (!best) return null;

    return {
      entryKey: best.entry.key,
      similarityScore: best.similarityScore,
      recommendedDecision: best.entry.decision,
      expectedOutcomeScore: best.entry.outcomeScore,
    };
  }

  size(): number {
    return this.entries.size;
  }
}

import { randomUUID } from "node:crypto";
import {
  ResilienceEvidenceEntry,
  ResilienceValue,
} from "./contracts";

export class GenesisResilienceEvidenceLedger {
  private readonly entries:
    ResilienceEvidenceEntry[] = [];

  append(
    input: {
      systemKey: string;
      category: string;
      action: string;
      message: string;
      metadata?: Record<string, ResilienceValue>;
    },
  ): ResilienceEvidenceEntry {
    const entry:
      ResilienceEvidenceEntry = {
      id: randomUUID(),
      systemKey:
        input.systemKey,
      category:
        input.category,
      action:
        input.action,
      message:
        input.message,
      metadata:
        structuredClone(
          input.metadata ?? {},
        ),
      createdAt:
        new Date().toISOString(),
    };

    this.entries.push(entry);

    return structuredClone(entry);
  }

  list(
    systemKey?: string,
  ): ResilienceEvidenceEntry[] {
    return this.entries
      .filter(
        (entry) =>
          systemKey
            ? entry.systemKey ===
              systemKey
            : true,
      )
      .map(
        (entry) =>
          structuredClone(entry),
      );
  }
}

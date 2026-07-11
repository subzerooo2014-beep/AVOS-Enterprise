import { randomUUID } from "node:crypto";
import {
  GenesisKnowledgeRecord,
  GenesisKnowledgeSyncResult,
} from "./contracts";

export class GenesisKnowledgeSynchronizer {
  private readonly records =
    new Map<
      string,
      GenesisKnowledgeRecord
    >();

  synchronize(
    incoming:
      readonly Omit<
        GenesisKnowledgeRecord,
        "id" | "createdAt" | "updatedAt"
      >[],
  ): GenesisKnowledgeSyncResult {
    let inserted = 0;
    let updated = 0;
    let skipped = 0;
    let conflicts = 0;

    const synchronized:
      GenesisKnowledgeRecord[] = [];

    for (const item of incoming) {
      const key =
        this.keyFor(
          item.namespace,
          item.topic,
        );

      const existing =
        this.records.get(key);

      const now =
        new Date().toISOString();

      if (!existing) {
        const record:
          GenesisKnowledgeRecord = {
          ...structuredClone(item),
          id: randomUUID(),
          createdAt: now,
          updatedAt: now,
        };

        this.records.set(
          key,
          record,
        );

        synchronized.push(
          structuredClone(record),
        );

        inserted += 1;
        continue;
      }

      if (
        existing.source !==
        item.source
      ) {
        conflicts += 1;
      }

      const same =
        existing.summary ===
          item.summary &&
        JSON.stringify(
          existing.facts,
        ) ===
          JSON.stringify(
            item.facts,
          );

      if (same) {
        skipped += 1;

        synchronized.push(
          structuredClone(existing),
        );

        continue;
      }

      const updatedRecord:
        GenesisKnowledgeRecord = {
        ...existing,
        ...structuredClone(item),
        updatedAt: now,
      };

      this.records.set(
        key,
        updatedRecord,
      );

      synchronized.push(
        structuredClone(updatedRecord),
      );

      updated += 1;
    }

    return {
      inserted,
      updated,
      skipped,
      conflicts,
      records: synchronized,
      synchronizedAt:
        new Date().toISOString(),
    };
  }

  list(): GenesisKnowledgeRecord[] {
    return Array.from(
      this.records.values(),
    ).map(
      (record) =>
        structuredClone(record),
    );
  }

  private keyFor(
    namespace: string,
    topic: string,
  ): string {
    return `${namespace}:${topic}`;
  }
}

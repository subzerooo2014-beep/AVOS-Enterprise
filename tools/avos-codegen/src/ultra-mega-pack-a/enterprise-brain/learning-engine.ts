import {
  randomUUID,
} from "node:crypto";
import {
  BrainKnowledgeRecord,
  BrainLearningResult,
  BrainLearningSignal,
  BrainQuery,
  BrainQueryResult,
} from "./contracts";

export class EnterpriseBrainLearningEngine {
  private readonly records =
    new Map<
      string,
      BrainKnowledgeRecord
    >();

  learn(
    signals:
      readonly BrainLearningSignal[],
  ): BrainLearningResult {
    let inserted = 0;
    let updated = 0;
    let merged = 0;

    const changed:
      BrainKnowledgeRecord[] = [];

    for (const signal of signals) {
      const key =
        this.keyFor(
          signal.namespace,
          signal.topic,
        );

      const existing =
        this.records.get(key);

      const now =
        new Date().toISOString();

      if (!existing) {
        const record:
          BrainKnowledgeRecord = {
          id: randomUUID(),
          namespace:
            signal.namespace,
          topic:
            signal.topic,
          summary:
            this.summary(signal),
          facts:
            structuredClone(
              signal.facts,
            ),
          confidence:
            this.clamp(
              signal.confidence,
            ),
          source:
            signal.source,
          createdAt: now,
          updatedAt: now,
        };

        this.records.set(
          key,
          record,
        );

        changed.push(
          structuredClone(record),
        );

        inserted += 1;
        continue;
      }

      const facts = {
        ...existing.facts,
        ...structuredClone(
          signal.facts,
        ),
      };

      const same =
        JSON.stringify(
          facts,
        ) ===
          JSON.stringify(
            existing.facts,
          ) &&
        existing.confidence ===
          this.clamp(
            signal.confidence,
          );

      if (same) {
        merged += 1;
      }
      else {
        updated += 1;
      }

      const record:
        BrainKnowledgeRecord = {
        ...existing,
        facts,
        confidence:
          Math.max(
            existing.confidence,
            this.clamp(
              signal.confidence,
            ),
          ),
        summary:
          this.summary(signal),
        source:
          signal.source,
        updatedAt: now,
      };

      this.records.set(
        key,
        record,
      );

      changed.push(
        structuredClone(record),
      );
    }

    return {
      inserted,
      updated,
      merged,
      records: changed,
      learnedAt:
        new Date().toISOString(),
    };
  }

  query(
    query: BrainQuery,
  ): BrainQueryResult {
    const records =
      Array.from(
        this.records.values(),
      ).filter(
        (record) => {
          if (
            query.namespace &&
            record.namespace !==
              query.namespace
          ) {
            return false;
          }

          if (
            query.topic &&
            record.topic !==
              query.topic
          ) {
            return false;
          }

          if (
            query.minimumConfidence !==
              undefined &&
            record.confidence <
              query.minimumConfidence
          ) {
            return false;
          }

          if (
            query.text &&
            ![
              record.namespace,
              record.topic,
              record.summary,
              JSON.stringify(
                record.facts,
              ),
            ]
              .join(" ")
              .toLowerCase()
              .includes(
                query.text.toLowerCase(),
              )
          ) {
            return false;
          }

          return true;
        },
      );

    return {
      records:
        records.map(
          (record) =>
            structuredClone(record),
        ),
      total:
        records.length,
      generatedAt:
        new Date().toISOString(),
    };
  }

  private summary(
    signal:
      BrainLearningSignal,
  ): string {
    return [
      signal.namespace,
      signal.topic,
      signal.source,
    ].join(" | ");
  }

  private keyFor(
    namespace: string,
    topic: string,
  ): string {
    return `${namespace}:${topic}`;
  }

  private clamp(
    value: number,
  ): number {
    return Math.max(
      0,
      Math.min(100, value),
    );
  }
}

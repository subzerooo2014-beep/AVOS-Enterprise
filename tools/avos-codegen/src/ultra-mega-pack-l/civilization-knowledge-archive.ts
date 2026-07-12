import { createHash, randomUUID } from "node:crypto";
import { UltraLValue } from "./contracts";

export interface CivilizationKnowledgeRecord {
  id: string;
  key: string;
  generation: number;
  category: string;
  payload: Record<string, UltraLValue>;
  previousHash: string | null;
  hash: string;
  archivedAt: string;
}

export interface CivilizationKnowledgeArchiveSnapshot {
  records: number;
  generations: number;
  integrityVerified: boolean;
  latestHash: string | null;
  generatedAt: string;
}

export class CivilizationKnowledgeArchive {
  private readonly records: CivilizationKnowledgeRecord[] = [];

  archive(
    key: string,
    category: string,
    payload: Record<string, UltraLValue>,
  ): CivilizationKnowledgeRecord {
    const previous = this.records[this.records.length - 1];
    const generation = previous ? previous.generation + 1 : 1;
    const previousHash = previous?.hash ?? null;
    const archivedAt = new Date().toISOString();

    const hash = createHash("sha256")
      .update(
        JSON.stringify({
          key,
          generation,
          category,
          payload,
          previousHash,
          archivedAt,
        }),
      )
      .digest("hex");

    const record: CivilizationKnowledgeRecord = {
      id: randomUUID(),
      key,
      generation,
      category,
      payload: structuredClone(payload),
      previousHash,
      hash,
      archivedAt,
    };

    this.records.push(record);
    return structuredClone(record);
  }

  snapshot(): CivilizationKnowledgeArchiveSnapshot {
    let integrityVerified = true;

    for (let index = 1; index < this.records.length; index += 1) {
      if (this.records[index]?.previousHash !== this.records[index - 1]?.hash) {
        integrityVerified = false;
        break;
      }
    }

    return {
      records: this.records.length,
      generations: this.records.at(-1)?.generation ?? 0,
      integrityVerified,
      latestHash: this.records.at(-1)?.hash ?? null,
      generatedAt: new Date().toISOString(),
    };
  }
}

import { createHash, randomUUID } from "node:crypto";
import { UltraOValue } from "./contracts";

export interface ContinuumRecord {
  id: string;
  generation: number;
  key: string;
  payload: Record<string, UltraOValue>;
  previousHash: string | null;
  hash: string;
  createdAt: string;
}

export interface KnowledgeContinuumResult {
  records: number;
  generation: number;
  continuityVerified: boolean;
  latestHash: string | null;
}

export class EternalKnowledgeContinuum {
  private readonly records: ContinuumRecord[] = [];

  append(key: string, payload: Record<string, UltraOValue>): ContinuumRecord {
    const previous = this.records.at(-1);
    const generation = (previous?.generation ?? 0) + 1;
    const previousHash = previous?.hash ?? null;
    const createdAt = new Date().toISOString();

    const hash = createHash("sha256")
      .update(JSON.stringify({ generation, key, payload, previousHash, createdAt }))
      .digest("hex");

    const record: ContinuumRecord = {
      id: randomUUID(),
      generation,
      key,
      payload: structuredClone(payload),
      previousHash,
      hash,
      createdAt,
    };

    this.records.push(record);
    return structuredClone(record);
  }

  verify(): KnowledgeContinuumResult {
    let continuityVerified = true;
    for (let index = 1; index < this.records.length; index += 1) {
      if (this.records[index]?.previousHash !== this.records[index - 1]?.hash) {
        continuityVerified = false;
        break;
      }
    }

    return {
      records: this.records.length,
      generation: this.records.at(-1)?.generation ?? 0,
      continuityVerified,
      latestHash: this.records.at(-1)?.hash ?? null,
    };
  }
}

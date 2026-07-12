import { createHash, randomUUID } from "node:crypto";
import { UltraNValue } from "./contracts";

export interface KnowledgeContinuityRecord {
  id: string;
  generation: number;
  key: string;
  payload: Record<string, UltraNValue>;
  previousHash: string | null;
  hash: string;
  createdAt: string;
}

export interface SupremeKnowledgeContinuityResult {
  records: number;
  generation: number;
  continuityVerified: boolean;
  recoveryPointHash: string | null;
  createdAt: string;
}

export class SupremeKnowledgeContinuity {
  private readonly records: KnowledgeContinuityRecord[] = [];

  preserve(
    key: string,
    payload: Record<string, UltraNValue>,
  ): KnowledgeContinuityRecord {
    const previous = this.records.at(-1);
    const generation = (previous?.generation ?? 0) + 1;
    const previousHash = previous?.hash ?? null;
    const createdAt = new Date().toISOString();

    const hash = createHash("sha256")
      .update(
        JSON.stringify({
          generation,
          key,
          payload,
          previousHash,
          createdAt,
        }),
      )
      .digest("hex");

    const record: KnowledgeContinuityRecord = {
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

  verify(): SupremeKnowledgeContinuityResult {
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
      recoveryPointHash: this.records.at(-1)?.hash ?? null,
      createdAt: new Date().toISOString(),
    };
  }
}

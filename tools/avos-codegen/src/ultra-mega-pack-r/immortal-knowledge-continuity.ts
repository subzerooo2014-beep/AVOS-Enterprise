import { createHash, randomUUID } from "node:crypto";
import { UltraRValue } from "./contracts";

export interface ImmortalKnowledgeRecord {
  id: string;
  generation: number;
  key: string;
  source: string;
  payload: Record<string, UltraRValue>;
  previousHash: string | null;
  hash: string;
  replicas: number;
  createdAt: string;
}

export interface ImmortalKnowledgeContinuityResult {
  records: number;
  generation: number;
  continuityVerified: boolean;
  replicaScore: number;
  latestHash: string | null;
}

export class ImmortalKnowledgeContinuity {
  private readonly records: ImmortalKnowledgeRecord[] = [];

  preserve(
    key: string,
    source: string,
    payload: Record<string, UltraRValue>,
    replicas: number,
  ): ImmortalKnowledgeRecord {
    const previous = this.records.at(-1);
    const generation = (previous?.generation ?? 0) + 1;
    const previousHash = previous?.hash ?? null;
    const createdAt = new Date().toISOString();

    const hash = createHash("sha256")
      .update(
        JSON.stringify({
          generation,
          key,
          source,
          payload,
          previousHash,
          replicas,
          createdAt,
        }),
      )
      .digest("hex");

    const record: ImmortalKnowledgeRecord = {
      id: randomUUID(),
      generation,
      key,
      source,
      payload: structuredClone(payload),
      previousHash,
      hash,
      replicas: Math.max(1, replicas),
      createdAt,
    };

    this.records.push(record);
    return structuredClone(record);
  }

  verify(): ImmortalKnowledgeContinuityResult {
    let continuityVerified = true;

    for (let index = 1; index < this.records.length; index += 1) {
      if (this.records[index]?.previousHash !== this.records[index - 1]?.hash) {
        continuityVerified = false;
        break;
      }
    }

    const replicaScore =
      this.records.length === 0
        ? 100
        : Math.round(
            this.records.reduce(
              (sum, record) => sum + Math.min(100, record.replicas * 20),
              0,
            ) / this.records.length,
          );

    return {
      records: this.records.length,
      generation: this.records.at(-1)?.generation ?? 0,
      continuityVerified,
      replicaScore,
      latestHash: this.records.at(-1)?.hash ?? null,
    };
  }
}

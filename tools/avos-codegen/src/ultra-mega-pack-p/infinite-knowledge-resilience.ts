import { createHash, randomUUID } from "node:crypto";
import { UltraPValue } from "./contracts";

export interface ResilientKnowledgeRecord {
  id: string;
  generation: number;
  key: string;
  payload: Record<string, UltraPValue>;
  previousHash: string | null;
  hash: string;
  replicas: number;
  createdAt: string;
}

export interface InfiniteKnowledgeResilienceResult {
  records: number;
  generation: number;
  integrityVerified: boolean;
  replicaScore: number;
  latestHash: string | null;
}

export class InfiniteKnowledgeResilience {
  private readonly records: ResilientKnowledgeRecord[] = [];

  preserve(
    key: string,
    payload: Record<string, UltraPValue>,
    replicas: number,
  ): ResilientKnowledgeRecord {
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
          replicas,
          createdAt,
        }),
      )
      .digest("hex");

    const record: ResilientKnowledgeRecord = {
      id: randomUUID(),
      generation,
      key,
      payload: structuredClone(payload),
      previousHash,
      hash,
      replicas: Math.max(1, replicas),
      createdAt,
    };

    this.records.push(record);
    return structuredClone(record);
  }

  verify(): InfiniteKnowledgeResilienceResult {
    let integrityVerified = true;

    for (let index = 1; index < this.records.length; index += 1) {
      if (this.records[index]?.previousHash !== this.records[index - 1]?.hash) {
        integrityVerified = false;
        break;
      }
    }

    const replicaScore =
      this.records.length === 0
        ? 100
        : Math.round(
            this.records.reduce(
              (sum, record) => sum + Math.min(100, record.replicas * 25),
              0,
            ) / this.records.length,
          );

    return {
      records: this.records.length,
      generation: this.records.at(-1)?.generation ?? 0,
      integrityVerified,
      replicaScore,
      latestHash: this.records.at(-1)?.hash ?? null,
    };
  }
}

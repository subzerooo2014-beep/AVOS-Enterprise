import { createHash, randomUUID } from "node:crypto";
import { UltraQValue } from "./contracts";

export interface KnowledgeGenesisRecord {
  id: string;
  generation: number;
  key: string;
  source: string;
  payload: Record<string, UltraQValue>;
  parentHash: string | null;
  hash: string;
  createdAt: string;
}

export interface PerpetualKnowledgeGenesisResult {
  records: number;
  generation: number;
  lineageVerified: boolean;
  latestHash: string | null;
  sourceCount: number;
}

export class PerpetualKnowledgeGenesis {
  private readonly records: KnowledgeGenesisRecord[] = [];

  generate(
    key: string,
    source: string,
    payload: Record<string, UltraQValue>,
  ): KnowledgeGenesisRecord {
    const previous = this.records.at(-1);
    const generation = (previous?.generation ?? 0) + 1;
    const parentHash = previous?.hash ?? null;
    const createdAt = new Date().toISOString();

    const hash = createHash("sha256")
      .update(JSON.stringify({ generation, key, source, payload, parentHash, createdAt }))
      .digest("hex");

    const record: KnowledgeGenesisRecord = {
      id: randomUUID(),
      generation,
      key,
      source,
      payload: structuredClone(payload),
      parentHash,
      hash,
      createdAt,
    };

    this.records.push(record);
    return structuredClone(record);
  }

  verify(): PerpetualKnowledgeGenesisResult {
    let lineageVerified = true;

    for (let index = 1; index < this.records.length; index += 1) {
      if (this.records[index]?.parentHash !== this.records[index - 1]?.hash) {
        lineageVerified = false;
        break;
      }
    }

    return {
      records: this.records.length,
      generation: this.records.at(-1)?.generation ?? 0,
      lineageVerified,
      latestHash: this.records.at(-1)?.hash ?? null,
      sourceCount: new Set(this.records.map((record) => record.source)).size,
    };
  }
}

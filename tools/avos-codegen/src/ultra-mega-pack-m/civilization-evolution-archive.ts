import { createHash, randomUUID } from "node:crypto";
import { UltraMValue } from "./contracts";

export interface EvolutionArchiveRecord {
  id: string;
  generation: number;
  key: string;
  parentHash: string | null;
  payload: Record<string, UltraMValue>;
  hash: string;
  createdAt: string;
}

export interface CivilizationEvolutionArchiveSnapshot {
  records: number;
  latestGeneration: number;
  lineageVerified: boolean;
  latestHash: string | null;
  generatedAt: string;
}

export class CivilizationEvolutionArchive {
  private readonly records: EvolutionArchiveRecord[] = [];

  append(
    key: string,
    payload: Record<string, UltraMValue>,
  ): EvolutionArchiveRecord {
    const previous = this.records[this.records.length - 1];
    const generation = (previous?.generation ?? 0) + 1;
    const parentHash = previous?.hash ?? null;
    const createdAt = new Date().toISOString();

    const hash = createHash("sha256")
      .update(
        JSON.stringify({
          generation,
          key,
          parentHash,
          payload,
          createdAt,
        }),
      )
      .digest("hex");

    const record: EvolutionArchiveRecord = {
      id: randomUUID(),
      generation,
      key,
      parentHash,
      payload: structuredClone(payload),
      hash,
      createdAt,
    };

    this.records.push(record);
    return structuredClone(record);
  }

  snapshot(): CivilizationEvolutionArchiveSnapshot {
    let lineageVerified = true;

    for (let index = 1; index < this.records.length; index += 1) {
      if (this.records[index]?.parentHash !== this.records[index - 1]?.hash) {
        lineageVerified = false;
        break;
      }
    }

    return {
      records: this.records.length,
      latestGeneration: this.records.at(-1)?.generation ?? 0,
      lineageVerified,
      latestHash: this.records.at(-1)?.hash ?? null,
      generatedAt: new Date().toISOString(),
    };
  }
}

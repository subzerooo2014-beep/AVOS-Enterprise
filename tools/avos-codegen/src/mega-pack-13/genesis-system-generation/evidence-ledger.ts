import { randomUUID } from "node:crypto";
import {
  GenesisEvidenceEntry,
  GenesisJsonValue,
} from "./contracts";

export class GenesisEvidenceLedger {
  private readonly entries:
    GenesisEvidenceEntry[] = [];

  append(
    input: {
      systemId: string;
      category: string;
      action: string;
      message: string;
      metadata?: Record<string, GenesisJsonValue>;
    },
  ): GenesisEvidenceEntry {
    const entry:
      GenesisEvidenceEntry = {
      id: randomUUID(),
      systemId:
        input.systemId,
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
    systemId?: string,
  ): GenesisEvidenceEntry[] {
    return this.entries
      .filter((entry) =>
        systemId
          ? entry.systemId === systemId
          : true,
      )
      .map((entry) =>
        structuredClone(entry),
      );
  }

  clear(): void {
    this.entries.length = 0;
  }
}

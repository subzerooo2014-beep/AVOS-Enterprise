import { Injectable } from "@nestjs/common";
import { createHash, randomUUID } from "node:crypto";

export interface AuditEntry {
  readonly auditId: string;
  readonly sequence: number;
  readonly occurredAt: string;
  readonly action: string;
  readonly actor: string;
  readonly subjectId: string;
  readonly previousHash: string;
  readonly hash: string;
}

@Injectable()
export class ImmutableAuditLedgerService {
  private readonly entries: AuditEntry[] = [];

  append(input: {
    readonly action: string;
    readonly actor: string;
    readonly subjectId: string;
  }): AuditEntry {
    const sequence = this.entries.length + 1;
    const occurredAt = new Date().toISOString();
    const previousHash =
      this.entries.length === 0
        ? "GENESIS"
        : this.entries[this.entries.length - 1].hash;

    const hash = createHash("sha256")
      .update(
        JSON.stringify({
          sequence,
          occurredAt,
          previousHash,
          ...input,
        }),
      )
      .digest("hex");

    const entry: AuditEntry = {
      auditId: `OMEGA-AUDIT-${randomUUID()}`,
      sequence,
      occurredAt,
      action: input.action,
      actor: input.actor,
      subjectId: input.subjectId,
      previousHash,
      hash,
    };

    this.entries.push(entry);
    return entry;
  }

  verify() {
    const valid = this.entries.every((entry, index) =>
      index === 0
        ? entry.previousHash === "GENESIS"
        : entry.previousHash === this.entries[index - 1].hash,
    );

    return {
      valid,
      entries: this.entries.length,
    };
  }

  all(): readonly AuditEntry[] {
    return [...this.entries];
  }
}


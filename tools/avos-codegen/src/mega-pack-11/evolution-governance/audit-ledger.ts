import { randomUUID } from "node:crypto";
import {
  EvolutionAuditEntry,
  EvolutionJsonValue,
} from "./contracts";

export class EvolutionAuditLedger {
  private readonly entries:
    EvolutionAuditEntry[] = [];

  append(
    input: {
      proposalId: string;
      action: string;
      actor: string;
      message: string;
      metadata?: Record<
        string,
        EvolutionJsonValue
      >;
    },
  ): EvolutionAuditEntry {
    const entry:
      EvolutionAuditEntry = {
      id: randomUUID(),
      proposalId:
        input.proposalId,
      action:
        input.action,
      actor:
        input.actor,
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
    proposalId?: string,
  ): EvolutionAuditEntry[] {
    return this.entries
      .filter((entry) =>
        proposalId
          ? entry.proposalId ===
            proposalId
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

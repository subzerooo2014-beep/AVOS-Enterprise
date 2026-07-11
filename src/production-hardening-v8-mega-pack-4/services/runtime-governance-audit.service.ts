import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  GovernanceActor,
  GovernanceAuditEntry,
  GovernanceAuditEventType,
  GovernanceIntegrityResult,
  GovernanceJsonValue,
} from "../contracts";
import {
  RuntimeGovernanceStore,
} from "../stores/runtime-governance.store";
import {
  buildGovernanceAuditHash,
  governanceSha256Json,
} from "../utils";

@Injectable()
export class RuntimeGovernanceAuditService {
  private static readonly GENESIS_HASH =
    "0".repeat(64);

  constructor(
    private readonly store:
      RuntimeGovernanceStore,
  ) {}

  append(input: {
    type: GovernanceAuditEventType;
    aggregateType: string;
    aggregateId: string;
    actor: GovernanceActor;
    payload:
      Record<string, GovernanceJsonValue>;
    metadata?:
      Record<string, GovernanceJsonValue>;
  }): GovernanceAuditEntry {
    const latest =
      this.store.getLatestAuditEntry();

    const sequence =
      (latest?.sequence ?? 0) + 1;

    const previousHash =
      latest?.entryHash ??
      RuntimeGovernanceAuditService
        .GENESIS_HASH;

    const createdAt =
      new Date().toISOString();

    const payloadHash =
      governanceSha256Json(input.payload);

    const entryHash =
      buildGovernanceAuditHash({
        sequence,
        type: input.type,
        aggregateType:
          input.aggregateType,
        aggregateId:
          input.aggregateId,
        actor: input.actor,
        payloadHash,
        previousHash,
        createdAt,
      });

    return this.store.appendAuditEntry({
      id: randomUUID(),
      sequence,
      type: input.type,
      aggregateType:
        input.aggregateType,
      aggregateId:
        input.aggregateId,
      actor: input.actor,
      payload: input.payload,
      metadata:
        input.metadata ?? {},
      previousHash,
      payloadHash,
      entryHash,
      createdAt,
    });
  }

  list(): GovernanceAuditEntry[] {
    return this.store.listAuditEntries();
  }

  verify(): GovernanceIntegrityResult {
    const entries =
      this.store
        .listAuditEntries()
        .sort(
          (a, b) =>
            a.sequence - b.sequence,
        );

    let previousHash =
      RuntimeGovernanceAuditService
        .GENESIS_HASH;

    for (
      let index = 0;
      index < entries.length;
      index += 1
    ) {
      const entry = entries[index];

      const expectedSequence =
        index + 1;

      const actualPayloadHash =
        governanceSha256Json(
          entry.payload,
        );

      if (
        entry.sequence !==
        expectedSequence
      ) {
        return this.failure(
          entries,
          index,
          entry.sequence,
          String(expectedSequence),
          String(entry.sequence),
        );
      }

      if (
        entry.previousHash !==
        previousHash
      ) {
        return this.failure(
          entries,
          index,
          entry.sequence,
          previousHash,
          entry.previousHash,
        );
      }

      if (
        entry.payloadHash !==
        actualPayloadHash
      ) {
        return this.failure(
          entries,
          index,
          entry.sequence,
          actualPayloadHash,
          entry.payloadHash,
        );
      }

      const expectedEntryHash =
        buildGovernanceAuditHash({
          sequence: entry.sequence,
          type: entry.type,
          aggregateType:
            entry.aggregateType,
          aggregateId:
            entry.aggregateId,
          actor: entry.actor,
          payloadHash:
            entry.payloadHash,
          previousHash:
            entry.previousHash,
          createdAt:
            entry.createdAt,
        });

      if (
        entry.entryHash !==
        expectedEntryHash
      ) {
        return this.failure(
          entries,
          index,
          entry.sequence,
          expectedEntryHash,
          entry.entryHash,
        );
      }

      previousHash =
        entry.entryHash;
    }

    return {
      valid: true,
      checkedEntries:
        entries.length,
      firstSequence:
        entries.length > 0
          ? entries[0].sequence
          : undefined,
      lastSequence:
        entries.length > 0
          ? entries[
              entries.length - 1
            ].sequence
          : undefined,
      verifiedAt:
        new Date().toISOString(),
    };
  }

  private failure(
    entries: GovernanceAuditEntry[],
    checkedEntries: number,
    brokenSequence: number,
    expectedHash: string,
    actualHash: string,
  ): GovernanceIntegrityResult {
    return {
      valid: false,
      checkedEntries,
      firstSequence:
        entries.length > 0
          ? entries[0].sequence
          : undefined,
      lastSequence:
        entries.length > 0
          ? entries[
              entries.length - 1
            ].sequence
          : undefined,
      brokenSequence,
      expectedHash,
      actualHash,
      verifiedAt:
        new Date().toISOString(),
    };
  }
}

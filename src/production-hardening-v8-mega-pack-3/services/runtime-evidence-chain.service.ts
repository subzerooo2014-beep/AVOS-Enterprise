import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  EvidenceEntry,
  EvidenceIntegrityResult,
  JsonValue,
  RuntimeActor,
} from "../contracts/runtime-resilience.contracts";
import { EvidenceEntryType } from "../contracts/runtime-resilience.enums";
import { RuntimeResilienceStore } from "../stores/runtime-resilience.store";
import {
  buildEvidenceEntryHash,
  sha256Json,
} from "../utils/runtime-hash.util";

@Injectable()
export class RuntimeEvidenceChainService {
  private static readonly GENESIS_HASH = "0".repeat(64);

  constructor(private readonly store: RuntimeResilienceStore) {}

  append(input: {
    type: EvidenceEntryType;
    aggregateType: string;
    aggregateId: string;
    actor: RuntimeActor;
    payload: Record<string, JsonValue>;
    metadata?: Record<string, JsonValue>;
  }): EvidenceEntry {
    const latest = this.store.getLatestEvidenceEntry();
    const sequence = (latest?.sequence ?? 0) + 1;
    const previousHash =
      latest?.entryHash ?? RuntimeEvidenceChainService.GENESIS_HASH;
    const createdAt = new Date().toISOString();
    const payloadHash = sha256Json(input.payload);

    const entryHash = buildEvidenceEntryHash({
      sequence,
      type: input.type,
      aggregateType: input.aggregateType,
      aggregateId: input.aggregateId,
      actor: input.actor,
      payloadHash,
      previousHash,
      createdAt,
    });

    return this.store.appendEvidence({
      id: randomUUID(),
      sequence,
      type: input.type,
      aggregateType: input.aggregateType,
      aggregateId: input.aggregateId,
      actor: input.actor,
      payload: input.payload,
      metadata: input.metadata ?? {},
      previousHash,
      payloadHash,
      entryHash,
      createdAt,
    });
  }

  list(): EvidenceEntry[] {
    return this.store.listEvidenceEntries();
  }

  verify(): EvidenceIntegrityResult {
    const entries = this.store
      .listEvidenceEntries()
      .sort((a, b) => a.sequence - b.sequence);

    let previousHash = RuntimeEvidenceChainService.GENESIS_HASH;

    for (let index = 0; index < entries.length; index += 1) {
      const entry = entries[index];
      const expectedSequence = index + 1;
      const actualPayloadHash = sha256Json(entry.payload);

      if (entry.sequence !== expectedSequence) {
        return {
          valid: false,
          checkedEntries: index,
          firstSequence: entries.length > 0 ? entries[0].sequence : undefined,
          lastSequence: entries.length > 0 ? entries[entries.length - 1].sequence : undefined,
          brokenSequence: entry.sequence,
          expectedHash: String(expectedSequence),
          actualHash: String(entry.sequence),
          verifiedAt: new Date().toISOString(),
        };
      }

      if (entry.previousHash !== previousHash) {
        return {
          valid: false,
          checkedEntries: index,
          firstSequence: entries.length > 0 ? entries[0].sequence : undefined,
          lastSequence: entries.length > 0 ? entries[entries.length - 1].sequence : undefined,
          brokenSequence: entry.sequence,
          expectedHash: previousHash,
          actualHash: entry.previousHash,
          verifiedAt: new Date().toISOString(),
        };
      }

      if (entry.payloadHash !== actualPayloadHash) {
        return {
          valid: false,
          checkedEntries: index,
          firstSequence: entries.length > 0 ? entries[0].sequence : undefined,
          lastSequence: entries.length > 0 ? entries[entries.length - 1].sequence : undefined,
          brokenSequence: entry.sequence,
          expectedHash: actualPayloadHash,
          actualHash: entry.payloadHash,
          verifiedAt: new Date().toISOString(),
        };
      }

      const expectedEntryHash = buildEvidenceEntryHash({
        sequence: entry.sequence,
        type: entry.type,
        aggregateType: entry.aggregateType,
        aggregateId: entry.aggregateId,
        actor: entry.actor,
        payloadHash: entry.payloadHash,
        previousHash: entry.previousHash,
        createdAt: entry.createdAt,
      });

      if (entry.entryHash !== expectedEntryHash) {
        return {
          valid: false,
          checkedEntries: index,
          firstSequence: entries.length > 0 ? entries[0].sequence : undefined,
          lastSequence: entries.length > 0 ? entries[entries.length - 1].sequence : undefined,
          brokenSequence: entry.sequence,
          expectedHash: expectedEntryHash,
          actualHash: entry.entryHash,
          verifiedAt: new Date().toISOString(),
        };
      }

      previousHash = entry.entryHash;
    }

    return {
      valid: true,
      checkedEntries: entries.length,
      firstSequence: entries.length > 0 ? entries[0].sequence : undefined,
      lastSequence: entries.length > 0 ? entries[entries.length - 1].sequence : undefined,
      verifiedAt: new Date().toISOString(),
    };
  }
}


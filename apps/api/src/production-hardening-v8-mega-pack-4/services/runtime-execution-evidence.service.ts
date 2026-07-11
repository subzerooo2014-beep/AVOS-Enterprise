import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  GovernanceActor,
  GovernanceJsonValue,
  RuntimeExecutionEvidence,
  RuntimeExecutionEvidenceType,
} from "../contracts";
import {
  RuntimeGovernanceStore,
} from "../stores/runtime-governance.store";
import {
  governanceSha256Json,
} from "../utils";

@Injectable()
export class RuntimeExecutionEvidenceService {
  private static readonly GENESIS_HASH =
    "0".repeat(64);

  constructor(
    private readonly store:
      RuntimeGovernanceStore,
  ) {}

  append(input: {
    changeExecutionId: string;
    runbookExecutionId?: string;
    stepExecutionId?: string;
    type:
      RuntimeExecutionEvidenceType;
    actor:
      GovernanceActor;
    payload:
      Record<
        string,
        GovernanceJsonValue
      >;
  }): RuntimeExecutionEvidence {
    const latest =
      this.store
        .getLatestExecutionEvidence();

    const sequence =
      (latest?.sequence ?? 0) + 1;

    const previousHash =
      latest?.entryHash ??
      RuntimeExecutionEvidenceService
        .GENESIS_HASH;

    const createdAt =
      new Date().toISOString();

    const payloadHash =
      governanceSha256Json(
        input.payload,
      );

    const entryHash =
      governanceSha256Json({
        sequence,
        changeExecutionId:
          input.changeExecutionId,
        runbookExecutionId:
          input.runbookExecutionId ??
          null,
        stepExecutionId:
          input.stepExecutionId ??
          null,
        type:
          input.type,
        actor:
          input.actor,
        payloadHash,
        previousHash,
        createdAt,
      });

    return this.store
      .appendExecutionEvidence({
        id:
          randomUUID(),
        sequence,
        changeExecutionId:
          input.changeExecutionId,
        runbookExecutionId:
          input.runbookExecutionId,
        stepExecutionId:
          input.stepExecutionId,
        type:
          input.type,
        actor:
          input.actor,
        payload:
          input.payload,
        previousHash,
        payloadHash,
        entryHash,
        createdAt,
      });
  }

  list():
    RuntimeExecutionEvidence[] {
    return this.store
      .listExecutionEvidence();
  }

  verify(): {
    valid: boolean;
    checkedEntries: number;
    brokenSequence?: number;
    expectedHash?: string;
    actualHash?: string;
    verifiedAt: string;
  } {
    const entries =
      this.list()
        .sort(
          (a, b) =>
            a.sequence - b.sequence,
        );

    let previousHash =
      RuntimeExecutionEvidenceService
        .GENESIS_HASH;

    for (
      let index = 0;
      index < entries.length;
      index += 1
    ) {
      const entry =
        entries[index];

      const payloadHash =
        governanceSha256Json(
          entry.payload,
        );

      const expectedHash =
        governanceSha256Json({
          sequence:
            entry.sequence,
          changeExecutionId:
            entry.changeExecutionId,
          runbookExecutionId:
            entry.runbookExecutionId ??
            null,
          stepExecutionId:
            entry.stepExecutionId ??
            null,
          type:
            entry.type,
          actor:
            entry.actor,
          payloadHash:
            entry.payloadHash,
          previousHash:
            entry.previousHash,
          createdAt:
            entry.createdAt,
        });

      if (
        entry.sequence !==
          index + 1 ||
        entry.previousHash !==
          previousHash ||
        entry.payloadHash !==
          payloadHash ||
        entry.entryHash !==
          expectedHash
      ) {
        return {
          valid:
            false,
          checkedEntries:
            index,
          brokenSequence:
            entry.sequence,
          expectedHash,
          actualHash:
            entry.entryHash,
          verifiedAt:
            new Date().toISOString(),
        };
      }

      previousHash =
        entry.entryHash;
    }

    return {
      valid:
        true,
      checkedEntries:
        entries.length,
      verifiedAt:
        new Date().toISOString(),
    };
  }
}

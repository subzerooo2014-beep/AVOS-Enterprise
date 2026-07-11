import { Injectable } from "@nestjs/common";
import {
  createHash,
  randomUUID,
} from "node:crypto";
import {
  MEGA_PACK_6_COLLECTIONS,
} from "./constants/mega-pack-6.constants";
import { AppendEvidenceChainDto } from "./dto/append-evidence-chain.dto";
import { EnterpriseSequenceService } from "./enterprise-sequence.service";
import { MegaPack6StorageService } from "./mega-pack-6-storage.service";
import {
  EvidenceChainEntry,
  EvidenceChainVerification,
} from "./automation.types";

@Injectable()
export class EvidenceChainService {
  constructor(
    private readonly storage:
      MegaPack6StorageService,
    private readonly sequence:
      EnterpriseSequenceService,
  ) {}

  async append(
    dto: AppendEvidenceChainDto,
  ): Promise<EvidenceChainEntry> {
    const entries =
      await this.storage.readCollection<EvidenceChainEntry>(
        MEGA_PACK_6_COLLECTIONS.evidenceChain,
      );

    const previous =
      entries
        .slice()
        .sort(
          (a, b) =>
            b.sequenceNumber -
            a.sequenceNumber,
        )[0];

    const sequenceNumber =
      previous
        ? previous.sequenceNumber + 1
        : 1;

    const previousHash =
      previous?.chainHash ??
      "GENESIS";

    const recordedAt =
      new Date().toISOString();

    const payloadHash =
      this.hash({
        evidenceType:
          dto.evidenceType,
        sourceType:
          dto.sourceType,
        sourceId:
          dto.sourceId,
        title:
          dto.title,
        description:
          dto.description,
        createdBy:
          dto.createdBy,
        payload:
          dto.payload,
        metadata:
          dto.metadata ?? {},
        recordedAt,
      });

    const chainHash =
      this.hash({
        sequenceNumber,
        previousHash,
        payloadHash,
      });

    const entry: EvidenceChainEntry = {
      id: randomUUID(),
      sequenceNumber,
      evidenceCode:
        this.sequence.next(
          "AVOS-EVC",
        ),
      evidenceType:
        dto.evidenceType,
      sourceType:
        dto.sourceType,
      sourceId:
        dto.sourceId,
      title:
        dto.title,
      description:
        dto.description,
      createdBy:
        dto.createdBy,
      payload:
        dto.payload,
      metadata:
        dto.metadata ?? {},
      previousHash,
      payloadHash,
      chainHash,
      recordedAt,
      createdAt:
        recordedAt,
      updatedAt:
        recordedAt,
    };

    entries.push(entry);

    await this.storage.writeCollection(
      MEGA_PACK_6_COLLECTIONS.evidenceChain,
      entries,
    );

    return entry;
  }

  async list():
    Promise<EvidenceChainEntry[]> {
    const entries =
      await this.storage.readCollection<EvidenceChainEntry>(
        MEGA_PACK_6_COLLECTIONS.evidenceChain,
      );

    return entries.sort(
      (a, b) =>
        a.sequenceNumber -
        b.sequenceNumber,
    );
  }

  async verify():
    Promise<EvidenceChainVerification> {
    const entries = await this.list();

    let validEntries = 0;
    let invalidEntries = 0;
    let brokenAtSequence:
      number | undefined;

    let expectedHash:
      string | undefined;

    let observedHash:
      string | undefined;

    for (
      let index = 0;
      index < entries.length;
      index += 1
    ) {
      const entry =
        entries[index];

      const expectedPreviousHash =
        index === 0
          ? "GENESIS"
          : entries[index - 1]
              .chainHash;

      const recalculatedPayloadHash =
        this.hash({
          evidenceType:
            entry.evidenceType,
          sourceType:
            entry.sourceType,
          sourceId:
            entry.sourceId,
          title:
            entry.title,
          description:
            entry.description,
          createdBy:
            entry.createdBy,
          payload:
            entry.payload,
          metadata:
            entry.metadata,
          recordedAt:
            entry.recordedAt,
        });

      const recalculatedChainHash =
        this.hash({
          sequenceNumber:
            entry.sequenceNumber,
          previousHash:
            expectedPreviousHash,
          payloadHash:
            recalculatedPayloadHash,
        });

      const valid =
        entry.previousHash ===
          expectedPreviousHash &&
        entry.payloadHash ===
          recalculatedPayloadHash &&
        entry.chainHash ===
          recalculatedChainHash;

      if (valid) {
        validEntries += 1;
        continue;
      }

      invalidEntries += 1;

      if (
        brokenAtSequence ===
        undefined
      ) {
        brokenAtSequence =
          entry.sequenceNumber;

        expectedHash =
          recalculatedChainHash;

        observedHash =
          entry.chainHash;
      }
    }

    return {
      verified:
        invalidEntries === 0,
      totalEntries:
        entries.length,
      validEntries,
      invalidEntries,
      brokenAtSequence,
      expectedHash,
      observedHash,
      verifiedAt:
        new Date().toISOString(),
    };
  }

  async latest():
    Promise<EvidenceChainEntry | null> {
    const entries = await this.list();

    return entries.length > 0
      ? entries[
          entries.length - 1
        ]
      : null;
  }

  private hash(
    value: unknown,
  ): string {
    return createHash("sha256")
      .update(
        this.stableStringify(value),
      )
      .digest("hex");
  }

  private stableStringify(
    value: unknown,
  ): string {
    if (
      value === null ||
      typeof value !== "object"
    ) {
      return JSON.stringify(value);
    }

    if (Array.isArray(value)) {
      return `[${value
        .map((item) =>
          this.stableStringify(item),
        )
        .join(",")}]`;
    }

    const record =
      value as Record<
        string,
        unknown
      >;

    return `{${Object.keys(record)
      .sort()
      .map(
        (key) =>
          `${JSON.stringify(key)}:${this.stableStringify(
            record[key],
          )}`,
      )
      .join(",")}}`;
  }
}

import { Injectable, NotFoundException } from "@nestjs/common";
import { createHash } from "crypto";
import { EvidenceRecord, EvidenceType } from "../foundation-pack-7.types";
import { TrustAuditLedgerService } from "../audit/trust-audit-ledger.service";

@Injectable()
export class EvidenceRegistryService {
  private readonly evidence = new Map<string, EvidenceRecord>();

  constructor(
    private readonly audit: TrustAuditLedgerService
  ) {}

  list() {
    return Array.from(this.evidence.values());
  }

  get(id: string) {
    const record = this.evidence.get(id);

    if (!record) {
      throw new NotFoundException(`Evidence record not found: ${id}`);
    }

    return record;
  }

  create(input: {
    type: EvidenceType;
    title: string;
    description: string;
    sourceId: string;
    sourceType: string;
    payload: Record<string, unknown>;
    reliabilityScore: number;
    correlationId: string;
    actorIdentityId: string;
  }) {
    const now = new Date().toISOString();
    const contentHash = createHash("sha256")
      .update(JSON.stringify(input.payload))
      .digest("hex");

    const record: EvidenceRecord = {
      id: `evidence:${Date.now()}:${this.evidence.size + 1}`,
      type: input.type,
      title: input.title,
      description: input.description,
      sourceId: input.sourceId,
      sourceType: input.sourceType,
      contentHash,
      payload: input.payload,
      reliabilityScore: this.clampScore(input.reliabilityScore),
      verified: false,
      createdAt: now
    };

    this.evidence.set(record.id, record);

    this.audit.record({
      correlationId: input.correlationId,
      category: "evidence",
      action: "evidence-created",
      subjectId: record.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      after: this.toAuditRecord(record),
      metadata: {
        sourceId: record.sourceId,
        contentHash: record.contentHash
      }
    });

    return record;
  }

  verify(
    id: string,
    input: {
      verifiedByIdentityId: string;
      correlationId: string;
      reliabilityScore?: number;
    }
  ) {
    const current = this.get(id);
    const updated: EvidenceRecord = {
      ...current,
      verified: true,
      verifiedByIdentityId: input.verifiedByIdentityId,
      reliabilityScore:
        input.reliabilityScore === undefined
          ? current.reliabilityScore
          : this.clampScore(input.reliabilityScore),
      verifiedAt: new Date().toISOString()
    };

    this.evidence.set(id, updated);

    this.audit.record({
      correlationId: input.correlationId,
      category: "evidence",
      action: "evidence-verified",
      subjectId: updated.id,
      actorIdentityId: input.verifiedByIdentityId,
      outcome: "success",
      before: this.toAuditRecord(current),
      after: this.toAuditRecord(updated),
      metadata: {}
    });

    return updated;
  }

  batch(ids: string[]) {
    return ids.map((id) => this.get(id));
  }

  summary() {
    const records = this.list();

    return {
      total: records.length,
      verified: records.filter((record) => record.verified).length,
      averageReliability:
        records.length === 0
          ? 0
          : Number(
              (
                records.reduce(
                  (sum, record) => sum + record.reliabilityScore,
                  0
                ) / records.length
              ).toFixed(2)
            )
    };
  }

  private clampScore(value: number) {
    return Math.max(0, Math.min(100, Number(value.toFixed(2))));
  }

  private toAuditRecord(record: EvidenceRecord) {
    return {
      id: record.id,
      type: record.type,
      reliabilityScore: record.reliabilityScore,
      verified: record.verified,
      contentHash: record.contentHash
    };
  }
}

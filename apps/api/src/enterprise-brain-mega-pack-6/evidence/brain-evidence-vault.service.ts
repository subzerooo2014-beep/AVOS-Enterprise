import { Injectable } from "@nestjs/common";
import { createHash } from "crypto";
import { BrainEvidenceRecord } from "../enterprise-brain-mega-pack-6.types";
import { BrainTrustAuditService } from "../observability/brain-trust-audit.service";

@Injectable()
export class BrainEvidenceVaultService {
  private readonly records = new Map<string, BrainEvidenceRecord>();

  constructor(
    private readonly audit: BrainTrustAuditService
  ) {}

  list() {
    return Array.from(this.records.values());
  }

  get(id: string) {
    const record = this.records.get(id);

    if (!record) {
      throw new Error(`Brain evidence not found: ${id}`);
    }

    return record;
  }

  add(input: {
    subjectId: string;
    category: BrainEvidenceRecord["category"];
    sourceType: string;
    sourceId: string;
    content: unknown;
    origin: string;
    capturedByIdentityId: string;
    confidence: number;
    correlationId: string;
  }) {
    const createdAt = new Date().toISOString();
    const serialized = JSON.stringify({
      subjectId: input.subjectId,
      category: input.category,
      sourceType: input.sourceType,
      sourceId: input.sourceId,
      content: input.content,
      origin: input.origin,
      createdAt
    });

    const record: BrainEvidenceRecord = {
      id: `brain-evidence:${Date.now()}:${this.records.size + 1}`,
      subjectId: input.subjectId,
      category: input.category,
      sourceType: input.sourceType,
      sourceId: input.sourceId,
      content: input.content,
      hash: createHash("sha256").update(serialized).digest("hex"),
      provenance: {
        origin: input.origin,
        capturedByIdentityId: input.capturedByIdentityId,
        capturedAt: createdAt
      },
      confidence: Math.max(0, Math.min(100, input.confidence)),
      verified: false,
      createdAt
    };

    this.records.set(record.id, record);

    this.audit.record({
      correlationId: input.correlationId,
      category: "evidence",
      action: "brain-evidence-added",
      subjectId: record.id,
      actorIdentityId: input.capturedByIdentityId,
      outcome: "success",
      metadata: {
        category: record.category,
        hash: record.hash
      }
    });

    return record;
  }

  verify(input: {
    evidenceId: string;
    verifiedByIdentityId: string;
    correlationId: string;
  }) {
    const current = this.get(input.evidenceId);

    const updated: BrainEvidenceRecord = {
      ...current,
      verified: true,
      verifiedByIdentityId: input.verifiedByIdentityId
    };

    this.records.set(updated.id, updated);

    this.audit.record({
      correlationId: input.correlationId,
      category: "evidence",
      action: "brain-evidence-verified",
      subjectId: updated.id,
      actorIdentityId: input.verifiedByIdentityId,
      outcome: "success",
      metadata: {
        hash: updated.hash
      }
    });

    return updated;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      verified: items.filter((x) => x.verified).length,
      unverified: items.filter((x) => !x.verified).length,
      averageConfidence:
        items.length === 0
          ? 0
          : Number(
              (
                items.reduce((sum, item) => sum + item.confidence, 0) /
                items.length
              ).toFixed(2)
            )
    };
  }
}

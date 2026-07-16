import { createHash } from "crypto";
import { Injectable } from "@nestjs/common";
import {
  FoundationEvidenceRecord
} from "../foundation-pack-20.types";
import { FoundationFinalAuditService } from "../observability/foundation-final-audit.service";

@Injectable()
export class FoundationEvidenceVaultService {
  private readonly evidence =
    new Map<string, FoundationEvidenceRecord>();

  constructor(
    private readonly audit: FoundationFinalAuditService
  ) {}

  list() {
    return Array.from(this.evidence.values());
  }

  add(input: {
    category: FoundationEvidenceRecord["category"];
    subjectId: string;
    outcome: FoundationEvidenceRecord["outcome"];
    details: Record<string, unknown>;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const createdAt = new Date().toISOString();

    const draft = {
      category: input.category,
      subjectId: input.subjectId,
      outcome: input.outcome,
      details: input.details,
      createdAt
    };

    const record: FoundationEvidenceRecord = {
      id: `foundation-evidence:${Date.now()}:${
        this.evidence.size + 1
      }`,
      ...draft,
      checksum: createHash("sha256")
        .update(JSON.stringify(draft))
        .digest("hex")
    };

    this.evidence.set(record.id, record);

    this.audit.record({
      correlationId: input.correlationId,
      category: "evidence",
      action: "foundation-evidence-recorded",
      subjectId: record.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        record.outcome === "passed"
          ? "success"
          : record.outcome === "warning"
            ? "warning"
            : "failure",
      metadata: {
        category: record.category,
        subjectId: record.subjectId
      }
    });

    return record;
  }

  summary() {
    const evidence = this.list();

    return {
      total: evidence.length,
      passed: evidence.filter(
        (item) => item.outcome === "passed"
      ).length,
      failed: evidence.filter(
        (item) => item.outcome === "failed"
      ).length,
      warnings: evidence.filter(
        (item) => item.outcome === "warning"
      ).length,
      categories: new Set(
        evidence.map((item) => item.category)
      ).size
    };
  }
}

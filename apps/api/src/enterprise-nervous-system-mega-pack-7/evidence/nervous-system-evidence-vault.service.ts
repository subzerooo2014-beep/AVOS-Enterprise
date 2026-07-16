import { Injectable } from "@nestjs/common";
import { NervousSystemEvidenceRecord } from "../enterprise-nervous-system-mega-pack-7.types";
import { NervousSystemFinalAuditService } from "../observability/nervous-system-final-audit.service";

@Injectable()
export class NervousSystemEvidenceVaultService {
  private readonly records =
    new Map<string, NervousSystemEvidenceRecord>();

  constructor(
    private readonly audit: NervousSystemFinalAuditService
  ) {}

  list() {
    return Array.from(this.records.values());
  }

  add(
    input: Omit<NervousSystemEvidenceRecord, "id" | "createdAt">
  ) {
    const record: NervousSystemEvidenceRecord = {
      ...input,
      id: `nervous-system-evidence:${Date.now()}:${this.records.size + 1}`,
      createdAt: new Date().toISOString()
    };

    this.records.set(record.id, record);

    this.audit.record({
      correlationId: input.correlationId,
      category: "evidence",
      action: "nervous-system-evidence-added",
      subjectId: record.id,
      actorIdentityId: input.createdByIdentityId,
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
    const items = this.list();

    return {
      total: items.length,
      passed: items.filter((x) => x.outcome === "passed").length,
      failed: items.filter((x) => x.outcome === "failed").length,
      warnings: items.filter((x) => x.outcome === "warning").length,
      categories: new Set(items.map((x) => x.category)).size
    };
  }
}

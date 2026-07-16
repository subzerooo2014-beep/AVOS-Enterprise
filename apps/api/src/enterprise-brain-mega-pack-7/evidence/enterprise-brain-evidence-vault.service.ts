import { Injectable } from "@nestjs/common";
import { EnterpriseBrainEvidenceRecord } from "../enterprise-brain-mega-pack-7.types";
import { EnterpriseBrainFinalAuditService } from "../observability/enterprise-brain-final-audit.service";

@Injectable()
export class EnterpriseBrainEvidenceVaultService {
  private readonly records =
    new Map<string, EnterpriseBrainEvidenceRecord>();

  constructor(
    private readonly audit: EnterpriseBrainFinalAuditService
  ) {}

  list() {
    return Array.from(this.records.values());
  }

  add(
    input: Omit<EnterpriseBrainEvidenceRecord, "id" | "createdAt">
  ) {
    const record: EnterpriseBrainEvidenceRecord = {
      ...input,
      id: `enterprise-brain-evidence:${Date.now()}:${this.records.size + 1}`,
      createdAt: new Date().toISOString()
    };

    this.records.set(record.id, record);

    this.audit.record({
      correlationId: input.correlationId,
      category: "evidence",
      action: "enterprise-brain-evidence-added",
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

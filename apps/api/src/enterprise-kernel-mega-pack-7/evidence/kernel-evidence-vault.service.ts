import { Injectable } from "@nestjs/common";
import { KernelOperationalEvidence } from "../enterprise-kernel-mega-pack-7.types";
import { EnterpriseKernelFinalAuditService } from "../observability/enterprise-kernel-final-audit.service";

@Injectable()
export class KernelEvidenceVaultService {
  private readonly items = new Map<string, KernelOperationalEvidence>();

  constructor(
    private readonly audit: EnterpriseKernelFinalAuditService
  ) {}

  add(
    input: Omit<KernelOperationalEvidence, "id" | "createdAt">
  ) {
    const item: KernelOperationalEvidence = {
      ...input,
      id: `kernel-evidence:${Date.now()}:${this.items.size + 1}`,
      createdAt: new Date().toISOString()
    };

    this.items.set(item.id, item);

    this.audit.record({
      correlationId: input.correlationId,
      category: "evidence",
      action: "kernel-operational-evidence-added",
      subjectId: item.id,
      actorIdentityId: input.createdByIdentityId,
      outcome:
        input.outcome === "passed"
          ? "success"
          : input.outcome === "warning"
            ? "warning"
            : "failure",
      metadata: {
        category: item.category,
        subjectId: item.subjectId
      }
    });

    return item;
  }

  list() {
    return Array.from(this.items.values());
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

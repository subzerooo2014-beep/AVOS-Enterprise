import { Injectable } from "@nestjs/common";
import { MeshAuditRecord } from "../enterprise-nervous-system-mega-pack-5.types";

@Injectable()
export class MeshAuditService {
  private readonly records: MeshAuditRecord[] = [];

  record(input: Omit<MeshAuditRecord, "id" | "occurredAt">) {
    const record: MeshAuditRecord = {
      ...input,
      id: `mesh-audit:${Date.now()}:${this.records.length + 1}`,
      occurredAt: new Date().toISOString()
    };

    this.records.push(record);
    return record;
  }

  list() {
    return [...this.records];
  }

  summary() {
    return {
      total: this.records.length,
      failures: this.records.filter((x) => x.outcome === "failure").length,
      warnings: this.records.filter((x) => x.outcome === "warning").length,
      blocked: this.records.filter((x) => x.outcome === "blocked").length
    };
  }
}

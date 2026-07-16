import { Injectable } from "@nestjs/common";
import { KernelDependencyConfigurationAuditRecord } from "../enterprise-kernel-mega-pack-2.types";

@Injectable()
export class KernelDependencyConfigurationAuditService {
  private readonly records:
    KernelDependencyConfigurationAuditRecord[] = [];

  record(
    input: Omit<
      KernelDependencyConfigurationAuditRecord,
      "id" | "occurredAt"
    >
  ) {
    const record: KernelDependencyConfigurationAuditRecord = {
      ...input,
      id: `kernel-dependency-config-audit:${Date.now()}:${
        this.records.length + 1
      }`,
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
      failures: this.records.filter(
        (record) => record.outcome === "failure"
      ).length,
      warnings: this.records.filter(
        (record) => record.outcome === "warning"
      ).length,
      blocked: this.records.filter(
        (record) => record.outcome === "blocked"
      ).length
    };
  }
}

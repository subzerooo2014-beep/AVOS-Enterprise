import { Injectable } from "@nestjs/common";
import type { FoundationSecurityFindingV1 } from "./foundation-governance-security-intelligence-v1.types";

@Injectable()
export class FoundationSecurityThreatV1Service {
  private readonly findings = new Map<string, FoundationSecurityFindingV1>();

  report(
    category: string,
    severity: FoundationSecurityFindingV1["severity"],
    source: string,
    description: string,
  ): FoundationSecurityFindingV1 {
    const now = new Date().toISOString();

    const finding: FoundationSecurityFindingV1 = {
      id: `security-finding-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      category,
      severity,
      source,
      description,
      status: "OPEN",
      createdAt: now,
      updatedAt: now,
    };

    this.findings.set(finding.id, finding);
    return { ...finding };
  }

  mitigate(id: string): FoundationSecurityFindingV1 | undefined {
    const finding = this.findings.get(id);

    if (!finding) return undefined;

    finding.status = "MITIGATED";
    finding.updatedAt = new Date().toISOString();
    return { ...finding };
  }

  list(): FoundationSecurityFindingV1[] {
    return Array.from(this.findings.values()).map((item) => ({ ...item }));
  }

  count(): number {
    return this.findings.size;
  }

  criticalCount(): number {
    return this.list().filter(
      (item) => item.severity === "CRITICAL" && item.status === "OPEN",
    ).length;
  }
}

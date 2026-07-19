import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  RemediationFinding,
  RemediationSeverity,
} from "./omega-remediation.types";

@Injectable()
export class FindingRegistryService {
  private readonly findings = new Map<string, RemediationFinding>();

  register(input: {
    readonly source: string;
    readonly category: string;
    readonly title: string;
    readonly description: string;
    readonly severity: RemediationSeverity;
    readonly evidenceIds?: readonly string[];
    readonly metadata?: Readonly<Record<string, unknown>>;
  }): RemediationFinding {
    const finding: RemediationFinding = {
      findingId: `OMEGA-FINDING-${randomUUID()}`,
      source: input.source,
      category: input.category,
      title: input.title,
      description: input.description,
      severity: input.severity,
      detectedAt: new Date().toISOString(),
      evidenceIds: input.evidenceIds ?? [],
      metadata: input.metadata ?? {},
    };

    this.findings.set(finding.findingId, finding);
    return finding;
  }

  get(findingId: string): RemediationFinding | null {
    return this.findings.get(findingId) ?? null;
  }

  all(): readonly RemediationFinding[] {
    return [...this.findings.values()];
  }

  clear(): void {
    this.findings.clear();
  }
}

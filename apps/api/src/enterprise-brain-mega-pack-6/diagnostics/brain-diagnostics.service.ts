import { Injectable } from "@nestjs/common";
import { BrainDiagnosticFinding } from "../enterprise-brain-mega-pack-6.types";
import { BrainEvidenceVaultService } from "../evidence/brain-evidence-vault.service";
import { BrainTrustScoreService } from "../trust/brain-trust-score.service";
import { BrainTrustAuditService } from "../observability/brain-trust-audit.service";

@Injectable()
export class BrainDiagnosticsService {
  private readonly findings = new Map<string, BrainDiagnosticFinding>();

  constructor(
    private readonly evidence: BrainEvidenceVaultService,
    private readonly trust: BrainTrustScoreService,
    private readonly audit: BrainTrustAuditService
  ) {}

  list() {
    return Array.from(this.findings.values());
  }

  get(id: string) {
    const finding = this.findings.get(id);

    if (!finding) {
      throw new Error(`Brain diagnostic finding not found: ${id}`);
    }

    return finding;
  }

  run(input: {
    subjectId: string;
    category: BrainDiagnosticFinding["category"];
    actorIdentityId: string;
    correlationId: string;
  }) {
    const evidence = this.evidence.list().filter(
      (item) => item.subjectId === input.subjectId
    );

    const trust = this.trust.list().filter(
      (item) => item.subjectId === input.subjectId
    );

    const findings: BrainDiagnosticFinding[] = [];

    if (evidence.length === 0) {
      findings.push(
        this.createFinding({
          category: input.category,
          severity: "warning",
          title: "Missing evidence",
          description: "No evidence records exist for the subject.",
          subjectId: input.subjectId,
          evidenceIds: [],
          recommendations: [
            "Capture decision evidence.",
            "Verify provenance and integrity."
          ],
          autoRecoverable: false
        })
      );
    }

    const latestTrust =
      trust.length === 0
        ? undefined
        : trust[trust.length - 1];

    if (latestTrust && latestTrust.score < 60) {
      findings.push(
        this.createFinding({
          category: "trust",
          severity: latestTrust.score < 35 ? "critical" : "error",
          title: "Low trust score",
          description:
            `Latest trust score is ${latestTrust.score}.`,
          subjectId: input.subjectId,
          evidenceIds: evidence.map((item) => item.id),
          recommendations: latestTrust.reasons,
          autoRecoverable: false
        })
      );
    }

    if (findings.length === 0) {
      findings.push(
        this.createFinding({
          category: input.category,
          severity: "info",
          title: "No critical diagnostic issue",
          description: "Brain diagnostics found no blocking issue.",
          subjectId: input.subjectId,
          evidenceIds: evidence.map((item) => item.id),
          recommendations: [],
          autoRecoverable: true
        })
      );
    }

    this.audit.record({
      correlationId: input.correlationId,
      category: "diagnostics",
      action: "brain-diagnostics-completed",
      subjectId: input.subjectId,
      actorIdentityId: input.actorIdentityId,
      outcome:
        findings.some(
          (finding) =>
            finding.severity === "critical" ||
            finding.severity === "error"
        )
          ? "warning"
          : "success",
      metadata: {
        findings: findings.length
      }
    });

    return {
      subjectId: input.subjectId,
      findings
    };
  }

  resolve(input: {
    findingId: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const current = this.get(input.findingId);

    const updated: BrainDiagnosticFinding = {
      ...current,
      resolved: true,
      resolvedAt: new Date().toISOString()
    };

    this.findings.set(updated.id, updated);
    return updated;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      critical: items.filter((x) => x.severity === "critical").length,
      errors: items.filter((x) => x.severity === "error").length,
      warnings: items.filter((x) => x.severity === "warning").length,
      unresolved: items.filter((x) => !x.resolved).length
    };
  }

  private createFinding(
    input: Omit<
      BrainDiagnosticFinding,
      "id" | "resolved" | "createdAt"
    >
  ) {
    const finding: BrainDiagnosticFinding = {
      ...input,
      id: `brain-diagnostic:${Date.now()}:${this.findings.size + 1}`,
      resolved: false,
      createdAt: new Date().toISOString()
    };

    this.findings.set(finding.id, finding);
    return finding;
  }
}

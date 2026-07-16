import { Injectable } from "@nestjs/common";
import {
  KernelDiagnosticFinding,
  KernelFailureRecord
} from "../enterprise-kernel-mega-pack-4.types";
import { KernelHealthRegistryService } from "../registry/kernel-health-registry.service";
import { KernelFailureClassifierService } from "../failures/kernel-failure-classifier.service";
import { KernelResilienceAuditService } from "../observability/kernel-resilience-audit.service";

@Injectable()
export class KernelDiagnosticsService {
  private readonly findings = new Map<string, KernelDiagnosticFinding>();

  constructor(
    private readonly health: KernelHealthRegistryService,
    private readonly failures: KernelFailureClassifierService,
    private readonly audit: KernelResilienceAuditService
  ) {}

  list() {
    return Array.from(this.findings.values());
  }

  diagnose(input: {
    componentId: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const component = this.health.getRecord(input.componentId);

    const relatedFailures = this.failures
      .list()
      .filter((failure) => failure.componentId === input.componentId);

    const probableCauses: string[] = [];
    const recommendedActions: KernelDiagnosticFinding["recommendedActions"] = [];

    if (component.consecutiveFailures >= 3) {
      probableCauses.push("Repeated component failures.");
      recommendedActions.push("isolate");
    }

    if (component.score < 70) {
      probableCauses.push("Component health score below target.");
      recommendedActions.push("restart");
    }

    for (const failure of relatedFailures) {
      this.enrichRecommendations(failure, probableCauses, recommendedActions);
    }

    if (probableCauses.length === 0) {
      probableCauses.push("No active critical cause detected.");
    }

    if (recommendedActions.length === 0) {
      recommendedActions.push("retry");
    }

    const finding: KernelDiagnosticFinding = {
      id: `kernel-diagnostic:${Date.now()}:${this.findings.size + 1}`,
      componentId: component.componentId,
      severity:
        relatedFailures.length === 0
          ? "info"
          : relatedFailures[relatedFailures.length - 1]?.severity ?? "warning",
      code: "KERNEL_COMPONENT_DIAGNOSTIC",
      title: `Diagnostic for ${component.componentName}`,
      description:
        component.status === "healthy"
          ? "Component is healthy."
          : `Component status is ${component.status}.`,
      probableCauses: Array.from(new Set(probableCauses)),
      recommendedActions: Array.from(new Set(recommendedActions)),
      evidence: {
        healthRecord: component,
        failureIds: relatedFailures.map((failure) => failure.id)
      },
      createdAt: new Date().toISOString()
    };

    this.findings.set(finding.id, finding);

    this.audit.record({
      correlationId: input.correlationId,
      category: "diagnostics",
      action: "kernel-component-diagnosed",
      subjectId: finding.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        finding.severity === "critical" || finding.severity === "fatal"
          ? "failure"
          : finding.severity === "warning" || finding.severity === "error"
            ? "warning"
            : "success",
      metadata: {
        componentId: input.componentId,
        recommendedActions: finding.recommendedActions
      }
    });

    return finding;
  }

  diagnoseAll(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    const findings = this.health
      .listRecords()
      .map((record) =>
        this.diagnose({
          componentId: record.componentId,
          actorIdentityId: input.actorIdentityId,
          correlationId: input.correlationId
        })
      );

    return {
      total: findings.length,
      findings,
      diagnosedAt: new Date().toISOString()
    };
  }

  summary() {
    const findings = this.list();

    return {
      total: findings.length,
      critical: findings.filter((x) => x.severity === "critical").length,
      fatal: findings.filter((x) => x.severity === "fatal").length,
      warnings: findings.filter((x) => x.severity === "warning").length
    };
  }

  private enrichRecommendations(
    failure: KernelFailureRecord,
    probableCauses: string[],
    recommendedActions: KernelDiagnosticFinding["recommendedActions"]
  ) {
    probableCauses.push(`${failure.category}: ${failure.message}`);

    if (failure.retryable) recommendedActions.push("retry");
    if (failure.requiresIsolation) recommendedActions.push("isolate");
    if (failure.category === "configuration") recommendedActions.push("restore-config");
    if (failure.severity === "critical") recommendedActions.push("safe-mode");
    if (!failure.recoverable) recommendedActions.push("manual-intervention");
  }
}

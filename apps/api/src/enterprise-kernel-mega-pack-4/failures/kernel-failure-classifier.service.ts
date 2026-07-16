import { Injectable } from "@nestjs/common";
import {
  KernelFailureCategory,
  KernelFailureRecord,
  KernelFailureSeverity
} from "../enterprise-kernel-mega-pack-4.types";
import { KernelHealthRegistryService } from "../registry/kernel-health-registry.service";
import { KernelResilienceAuditService } from "../observability/kernel-resilience-audit.service";

@Injectable()
export class KernelFailureClassifierService {
  private readonly failures = new Map<string, KernelFailureRecord>();

  constructor(
    private readonly health: KernelHealthRegistryService,
    private readonly audit: KernelResilienceAuditService
  ) {}

  list() {
    return Array.from(this.failures.values());
  }

  get(id: string) {
    const failure = this.failures.get(id);

    if (!failure) {
      throw new Error(`Kernel failure not found: ${id}`);
    }

    return failure;
  }

  classify(input: {
    componentId: string;
    code: string;
    message: string;
    context?: Record<string, unknown>;
    correlationId: string;
    actorIdentityId: string;
  }) {
    const component = this.health.getRecord(input.componentId);
    const category = this.category(input.code, input.message);
    const severity = this.severity(component.score, component.consecutiveFailures, input.code);

    const failure: KernelFailureRecord = {
      id: `kernel-failure:${Date.now()}:${this.failures.size + 1}`,
      componentId: input.componentId,
      category,
      severity,
      code: input.code,
      message: input.message,
      recoverable: severity !== "fatal",
      retryable:
        ["network", "resource", "runtime", "storage"].includes(category),
      requiresIsolation:
        severity === "critical" ||
        severity === "fatal" ||
        component.consecutiveFailures >= 3,
      requiresHumanApproval:
        severity === "critical" ||
        severity === "fatal",
      context: input.context ?? {},
      correlationId: input.correlationId,
      occurredAt: new Date().toISOString()
    };

    this.failures.set(failure.id, failure);

    this.audit.record({
      correlationId: input.correlationId,
      category: "failure",
      action: "kernel-failure-classified",
      subjectId: failure.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        severity === "fatal" || severity === "critical"
          ? "failure"
          : "warning",
      metadata: {
        componentId: input.componentId,
        category,
        severity,
        recoverable: failure.recoverable
      }
    });

    return failure;
  }

  summary() {
    const failures = this.list();

    return {
      total: failures.length,
      recoverable: failures.filter((x) => x.recoverable).length,
      critical: failures.filter((x) => x.severity === "critical").length,
      fatal: failures.filter((x) => x.severity === "fatal").length,
      requiringIsolation: failures.filter((x) => x.requiresIsolation).length,
      requiringHumanApproval: failures.filter((x) => x.requiresHumanApproval).length
    };
  }

  private category(code: string, message: string): KernelFailureCategory {
    const text = `${code} ${message}`.toLowerCase();

    if (text.includes("depend")) return "dependency";
    if (text.includes("config")) return "configuration";
    if (text.includes("security") || text.includes("auth")) return "security";
    if (text.includes("policy")) return "policy";
    if (text.includes("network") || text.includes("timeout")) return "network";
    if (text.includes("database") || text.includes("storage")) return "storage";
    if (text.includes("memory") || text.includes("cpu") || text.includes("resource")) return "resource";
    if (text.includes("module")) return "module";
    if (text.includes("runtime")) return "runtime";
    return "unknown";
  }

  private severity(
    score: number,
    failures: number,
    code: string
  ): KernelFailureSeverity {
    if (code.toUpperCase().includes("FATAL")) return "fatal";
    if (score <= 20 || failures >= 5) return "critical";
    if (score <= 50 || failures >= 3) return "error";
    if (score <= 75 || failures >= 1) return "warning";
    return "info";
  }
}

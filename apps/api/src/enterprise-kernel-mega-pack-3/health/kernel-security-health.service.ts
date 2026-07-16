import { Injectable } from "@nestjs/common";
import { KernelSecurityHealthIndex } from "../enterprise-kernel-mega-pack-3.types";
import { KernelPrincipalRegistryService } from "../authorization/kernel-principal-registry.service";
import { KernelPermissionRegistryService } from "../permissions/kernel-permission-registry.service";
import { KernelPolicyRegistryService } from "../policies/kernel-policy-registry.service";
import { KernelApprovalService } from "../approvals/kernel-approval.service";
import { KernelControlledExecutionService } from "../execution/kernel-controlled-execution.service";
import { KernelSecurityAuditService } from "../observability/kernel-security-audit.service";

@Injectable()
export class KernelSecurityHealthService {
  private readonly indexes =
    new Map<string, KernelSecurityHealthIndex>();

  constructor(
    private readonly principals: KernelPrincipalRegistryService,
    private readonly permissions: KernelPermissionRegistryService,
    private readonly policies: KernelPolicyRegistryService,
    private readonly approvals: KernelApprovalService,
    private readonly executions: KernelControlledExecutionService,
    private readonly audit: KernelSecurityAuditService
  ) {}

  list() {
    return Array.from(this.indexes.values());
  }

  calculate(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    const principalSummary =
      this.principals.summary();

    const permissionSummary =
      this.permissions.summary();

    const policySummary =
      this.policies.summary();

    const approvalSummary =
      this.approvals.summary();

    const executionSummary =
      this.executions.summary();

    const principalCoverageScore =
      principalSummary.total >= 3 &&
      principalSummary.active ===
        principalSummary.total
        ? 100
        : 70;

    const permissionCoverageScore =
      permissionSummary.total >=
      principalSummary.total
        ? 100
        : 70;

    const policyCoverageScore =
      policySummary.active >= 3
        ? 100
        : 70;

    const approvalControlScore =
      approvalSummary.rejected > 0
        ? 80
        : 100;

    const executionControlScore =
      executionSummary.failed === 0
        ? 100
        : Math.max(
            0,
            100 -
              executionSummary.failed * 20
          );

    const score = Number(
      (
        principalCoverageScore * 0.2 +
        permissionCoverageScore * 0.2 +
        policyCoverageScore * 0.25 +
        approvalControlScore * 0.15 +
        executionControlScore * 0.2
      ).toFixed(2)
    );

    const reasons: string[] = [];

    if (principalCoverageScore < 90) {
      reasons.push(
        "Kernel principal coverage requires improvement."
      );
    }

    if (permissionCoverageScore < 90) {
      reasons.push(
        "Kernel permission coverage requires improvement."
      );
    }

    if (policyCoverageScore < 90) {
      reasons.push(
        "Kernel policy coverage requires improvement."
      );
    }

    if (executionControlScore < 90) {
      reasons.push(
        "Kernel execution control contains failures."
      );
    }

    if (reasons.length === 0) {
      reasons.push(
        "Kernel security, policy, and execution control are healthy."
      );
    }

    const index: KernelSecurityHealthIndex = {
      id: `kernel-security-health:${Date.now()}:${
        this.indexes.size + 1
      }`,
      score,
      level: this.level(score),
      metrics: {
        principalCoverageScore,
        permissionCoverageScore,
        policyCoverageScore,
        approvalControlScore,
        executionControlScore
      },
      reasons,
      calculatedAt: new Date().toISOString()
    };

    this.indexes.set(index.id, index);

    this.audit.record({
      correlationId: input.correlationId,
      category: "health",
      action: "kernel-security-health-calculated",
      subjectId: index.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        score >= 75
          ? "success"
          : score >= 50
            ? "warning"
            : "failure",
      metadata: {
        score,
        level: index.level
      }
    });

    return index;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      latestScore:
        items.length === 0
          ? 0
          : items[items.length - 1]?.score ?? 0,
      healthy: items.filter(
        (item) =>
          item.level === "healthy" ||
          item.level === "excellent"
      ).length
    };
  }

  private level(
    score: number
  ): KernelSecurityHealthIndex["level"] {
    if (score >= 90) return "excellent";
    if (score >= 75) return "healthy";
    if (score >= 60) return "stable";
    if (score >= 40) return "degraded";
    return "critical";
  }
}

import { Injectable } from "@nestjs/common";
import { KernelTrustAssessment } from "../enterprise-kernel-mega-pack-3.types";
import { KernelPrincipalRegistryService } from "../authorization/kernel-principal-registry.service";
import { KernelSecurityAuditService } from "../observability/kernel-security-audit.service";

@Injectable()
export class KernelTrustIntegrationService {
  private readonly assessments =
    new Map<string, KernelTrustAssessment>();

  constructor(
    private readonly principals: KernelPrincipalRegistryService,
    private readonly audit: KernelSecurityAuditService
  ) {}

  assess(input: {
    principalId: string;
    resource: string;
    action: string;
    risk: KernelTrustAssessment["risk"];
    correlationId: string;
  }) {
    const principal = this.principals.get(
      input.principalId
    );

    let trustScore = principal.active ? 70 : 0;
    const reasons: string[] = [];

    if (principal.roles.includes("kernel-owner")) {
      trustScore += 20;
      reasons.push(
        "Principal has kernel-owner role."
      );
    }

    if (principal.roles.includes("kernel-system")) {
      trustScore += 15;
      reasons.push(
        "Principal is a kernel system identity."
      );
    }

    if (input.risk === "critical") {
      trustScore -= 20;
      reasons.push(
        "Critical execution risk reduces trust score."
      );
    }
    else if (input.risk === "high") {
      trustScore -= 10;
      reasons.push(
        "High execution risk reduces trust score."
      );
    }

    trustScore = Math.max(
      0,
      Math.min(100, trustScore)
    );

    const assessment: KernelTrustAssessment = {
      id: `kernel-trust-assessment:${Date.now()}:${
        this.assessments.size + 1
      }`,
      principalId: principal.id,
      resource: input.resource,
      action: input.action,
      trustScore,
      confidence: 90,
      risk: input.risk,
      reasons,
      assessedAt: new Date().toISOString()
    };

    this.assessments.set(
      assessment.id,
      assessment
    );

    this.audit.record({
      correlationId: input.correlationId,
      category: "trust",
      action: "kernel-trust-assessed",
      subjectId: assessment.id,
      actorIdentityId: principal.id,
      outcome:
        trustScore >= 60
          ? "success"
          : "warning",
      metadata: {
        trustScore,
        risk: input.risk
      }
    });

    return assessment;
  }

  list() {
    return Array.from(
      this.assessments.values()
    );
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      averageTrustScore:
        items.length === 0
          ? 0
          : Number(
              (
                items.reduce(
                  (sum, item) =>
                    sum + item.trustScore,
                  0
                ) / items.length
              ).toFixed(2)
            )
    };
  }
}

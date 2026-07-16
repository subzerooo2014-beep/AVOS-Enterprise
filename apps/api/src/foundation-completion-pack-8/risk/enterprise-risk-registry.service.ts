import { Injectable, NotFoundException } from "@nestjs/common";
import {
  EnterpriseRiskRecord,
  GovernanceScope,
  RiskLevel
} from "../foundation-pack-8.types";
import { GovernanceAuditService } from "../observability/governance-audit.service";

@Injectable()
export class EnterpriseRiskRegistryService {
  private readonly risks = new Map<string, EnterpriseRiskRecord>();

  constructor(
    private readonly audit: GovernanceAuditService
  ) {}

  list() {
    return Array.from(this.risks.values());
  }

  get(id: string) {
    const risk = this.risks.get(id);

    if (!risk) {
      throw new NotFoundException(`Risk record not found: ${id}`);
    }

    return risk;
  }

  register(input: {
    title: string;
    description: string;
    subjectId: string;
    subjectType: GovernanceScope;
    category: EnterpriseRiskRecord["category"];
    likelihood: number;
    impact: number;
    mitigationActions?: string[];
    ownerIdentityId: string;
    correlationId: string;
  }) {
    const likelihood = this.clamp(input.likelihood);
    const impact = this.clamp(input.impact);
    const inherentScore = Number(
      ((likelihood * impact) / 100).toFixed(2)
    );

    const risk: EnterpriseRiskRecord = {
      id: `enterprise-risk:${Date.now()}:${this.risks.size + 1}`,
      title: input.title,
      description: input.description,
      subjectId: input.subjectId,
      subjectType: input.subjectType,
      category: input.category,
      likelihood,
      impact,
      inherentScore,
      residualScore: inherentScore,
      level: this.level(inherentScore),
      mitigationActions: input.mitigationActions ?? [],
      ownerIdentityId: input.ownerIdentityId,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.risks.set(risk.id, risk);

    this.audit.record({
      correlationId: input.correlationId,
      category: "risk",
      action: "risk-registered",
      subjectId: risk.id,
      actorIdentityId: input.ownerIdentityId,
      outcome:
        risk.level === "critical" ? "warning" : "success",
      metadata: {
        inherentScore: risk.inherentScore,
        level: risk.level
      }
    });

    return risk;
  }

  mitigate(
    id: string,
    input: {
      residualScore: number;
      mitigationActions: string[];
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    const current = this.get(id);
    const residualScore = this.clamp(input.residualScore);

    const updated: EnterpriseRiskRecord = {
      ...current,
      residualScore,
      level: this.level(residualScore),
      mitigationActions: Array.from(
        new Set([
          ...current.mitigationActions,
          ...input.mitigationActions
        ])
      ),
      updatedAt: new Date().toISOString()
    };

    this.risks.set(id, updated);

    this.audit.record({
      correlationId: input.correlationId,
      category: "risk",
      action: "risk-mitigated",
      subjectId: id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        updated.level === "critical" ? "warning" : "success",
      metadata: {
        previousResidualScore: current.residualScore,
        residualScore: updated.residualScore,
        level: updated.level
      }
    });

    return updated;
  }

  bySubject(subjectId: string) {
    return this.list().filter(
      (risk) => risk.subjectId === subjectId
    );
  }

  summary() {
    const active = this.list().filter((risk) => risk.active);

    return {
      total: this.risks.size,
      active: active.length,
      critical: active.filter(
        (risk) => risk.level === "critical"
      ).length,
      high: active.filter(
        (risk) => risk.level === "high"
      ).length,
      averageResidualScore:
        active.length === 0
          ? 0
          : Number(
              (
                active.reduce(
                  (sum, risk) => sum + risk.residualScore,
                  0
                ) / active.length
              ).toFixed(2)
            )
    };
  }

  private clamp(value: number) {
    return Math.max(0, Math.min(100, Number(value.toFixed(2))));
  }

  private level(score: number): RiskLevel {
    if (score >= 75) {
      return "critical";
    }

    if (score >= 50) {
      return "high";
    }

    if (score >= 25) {
      return "moderate";
    }

    return "low";
  }
}

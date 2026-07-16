import { Injectable, NotFoundException } from "@nestjs/common";
import {
  EnterpriseRiskRecord,
  GovernanceSeverity
} from "../foundation-pack-5.types";

@Injectable()
export class EnterpriseRiskGovernanceService {
  private readonly risks = new Map<string, EnterpriseRiskRecord>();

  list() {
    return Array.from(this.risks.values());
  }

  get(id: string) {
    const risk = this.risks.get(id);

    if (!risk) {
      throw new NotFoundException(`Enterprise risk not found: ${id}`);
    }

    return risk;
  }

  register(
    input: Omit<
      EnterpriseRiskRecord,
      "id" | "score" | "severity" | "createdAt" | "updatedAt"
    >
  ) {
    const likelihood = this.clampFive(input.likelihood);
    const impact = this.clampFive(input.impact);
    const score = likelihood * impact;
    const severity = this.resolveSeverity(score);
    const now = new Date().toISOString();

    const risk: EnterpriseRiskRecord = {
      ...input,
      id: `risk:${Date.now()}`,
      likelihood,
      impact,
      score,
      severity,
      mitigationActions: Array.from(new Set(input.mitigationActions)),
      createdAt: now,
      updatedAt: now
    };

    this.risks.set(risk.id, risk);
    return risk;
  }

  updateStatus(
    id: string,
    status: EnterpriseRiskRecord["status"]
  ) {
    const current = this.get(id);

    const updated: EnterpriseRiskRecord = {
      ...current,
      status,
      updatedAt: new Date().toISOString()
    };

    this.risks.set(id, updated);
    return updated;
  }

  summary() {
    const risks = this.list();

    return {
      total: risks.length,
      critical: risks.filter((risk) => risk.severity === "critical").length,
      high: risks.filter((risk) => risk.severity === "high").length,
      open: risks.filter((risk) => risk.status === "open").length
    };
  }

  private clampFive(value: number) {
    return Math.max(1, Math.min(5, Math.round(value)));
  }

  private resolveSeverity(score: number): GovernanceSeverity {
    if (score >= 20) {
      return "critical";
    }

    if (score >= 12) {
      return "high";
    }

    if (score >= 6) {
      return "medium";
    }

    return "low";
  }
}

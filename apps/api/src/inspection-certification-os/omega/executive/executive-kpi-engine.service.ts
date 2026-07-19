import { Injectable } from "@nestjs/common";
import { ExecutiveKpi, HistoricalSnapshot } from "./omega-executive.types";

@Injectable()
export class ExecutiveKpiEngineService {
  calculate(current: HistoricalSnapshot, previous?: HistoricalSnapshot): readonly ExecutiveKpi[] {
    return [
      this.kpi(
        "readiness",
        "Certification Readiness",
        current.readinessScore,
        "score",
        previous ? current.readinessScore - previous.readinessScore : 0,
        current.readinessScore >= 75,
      ),
      this.kpi(
        "risk",
        "Enterprise Risk",
        current.riskScore,
        "score",
        previous ? previous.riskScore - current.riskScore : 0,
        current.riskScore <= 35,
      ),
      this.kpi(
        "open-issues",
        "Open Issues",
        current.openIssues,
        "count",
        previous ? previous.openIssues - current.openIssues : 0,
        current.openIssues <= 8,
      ),
      this.kpi(
        "certified-assets",
        "Certified Assets",
        current.certifiedAssets,
        "count",
        previous ? current.certifiedAssets - previous.certifiedAssets : 0,
        current.certifiedAssets >= 10,
      ),
      this.kpi(
        "pending-approvals",
        "Pending Approvals",
        current.pendingApprovals,
        "count",
        previous ? previous.pendingApprovals - current.pendingApprovals : 0,
        current.pendingApprovals <= 3,
      ),
    ];
  }

  private kpi(
    key: string,
    label: string,
    value: number,
    unit: ExecutiveKpi["unit"],
    change: number,
    healthy: boolean,
  ): ExecutiveKpi {
    return {
      key,
      label,
      value,
      unit,
      direction: change > 0 ? "up" : change < 0 ? "down" : "stable",
      healthy,
    };
  }
}

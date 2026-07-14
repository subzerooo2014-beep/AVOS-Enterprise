import { Injectable } from "@nestjs/common";
import { EnterpriseAnomaly } from "./enterprise-e6.types";
import { EnterpriseRemediationPlannerService } from "./enterprise-remediation-planner.service";

@Injectable()
export class EnterpriseSelfHealingService {
  constructor(
    private readonly remediation: EnterpriseRemediationPlannerService,
  ) {}

  heal(anomaly: EnterpriseAnomaly) {
    const plan = this.remediation.plan(anomaly);
    const executed = this.remediation.execute(plan.id);

    return {
      success: executed.status === "COMPLETED",
      anomalyId: anomaly.id,
      remediation: executed,
      healedAt: new Date().toISOString(),
    };
  }
}
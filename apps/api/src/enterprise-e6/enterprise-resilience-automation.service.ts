import { Injectable } from "@nestjs/common";
import { EnterpriseAnomalyDetectionService } from "./enterprise-anomaly-detection.service";
import { EnterpriseFailoverCoordinatorService } from "./enterprise-failover-coordinator.service";
import { EnterpriseRemediationPlannerService } from "./enterprise-remediation-planner.service";
import { EnterpriseRecoverySnapshot } from "./enterprise-e6.types";

@Injectable()
export class EnterpriseResilienceAutomationService {
  constructor(
    private readonly anomalies: EnterpriseAnomalyDetectionService,
    private readonly remediation: EnterpriseRemediationPlannerService,
    private readonly failover: EnterpriseFailoverCoordinatorService,
  ) {}

  snapshot(): EnterpriseRecoverySnapshot {
    const failed = this.remediation.failedCount();
    const active = this.remediation.activeCount();

    return {
      detectedAnomalies: this.anomalies.count(),
      activePlans: active,
      completedPlans: this.remediation.completedCount(),
      failedPlans: failed,
      selfHealingReadiness: Math.max(0, 100 - failed * 20 - active * 5),
      autonomousOperations: true,
      generatedAt: new Date().toISOString(),
    };
  }

  bootstrap() {
    if (this.failover.list().length === 0) {
      this.failover.register("primary-runtime", 1, true);
      this.failover.register("secondary-runtime", 2, true);
    }

    return {
      success: true,
      failover: this.failover.failover(),
      recovery: this.snapshot(),
    };
  }
}
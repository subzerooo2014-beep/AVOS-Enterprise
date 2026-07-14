import { Injectable } from "@nestjs/common";
import { EnterpriseAnomalyDetectionService } from "./enterprise-anomaly-detection.service";
import { EnterpriseSelfHealingService } from "./enterprise-self-healing.service";
import { EnterpriseAnomalySeverity } from "./enterprise-e6.types";

@Injectable()
export class EnterpriseAutoRemediationService {
  constructor(
    private readonly anomalies: EnterpriseAnomalyDetectionService,
    private readonly healing: EnterpriseSelfHealingService,
  ) {}

  remediate(input: {
    source?: string;
    code?: string;
    severity?: EnterpriseAnomalySeverity;
    details?: Record<string, unknown>;
  }) {
    const anomaly = this.anomalies.detect(input);
    const healing = this.healing.heal(anomaly);

    return {
      success: healing.success,
      anomaly,
      remediation: healing.remediation,
      completedAt: new Date().toISOString(),
    };
  }
}
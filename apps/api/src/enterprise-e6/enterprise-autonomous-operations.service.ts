import { Injectable } from "@nestjs/common";
import { EnterpriseAutoRemediationService } from "./enterprise-auto-remediation.service";
import { EnterpriseResilienceAutomationService } from "./enterprise-resilience-automation.service";
import {
  EnterpriseAnomalySeverity,
  EnterpriseAutonomousOperationResult,
} from "./enterprise-e6.types";

@Injectable()
export class EnterpriseAutonomousOperationsService {
  constructor(
    private readonly autoRemediation: EnterpriseAutoRemediationService,
    private readonly resilience: EnterpriseResilienceAutomationService,
  ) {}

  execute(input: {
    source?: string;
    code?: string;
    severity?: EnterpriseAnomalySeverity;
    details?: Record<string, unknown>;
  }): EnterpriseAutonomousOperationResult {
    const result = this.autoRemediation.remediate(input);
    const recovery = this.resilience.snapshot();

    return {
      success: result.success,
      status: result.success ? "COMPLETED" : "FAILED",
      anomaly: result.anomaly,
      remediation: result.remediation,
      recovery,
      completedAt: new Date().toISOString(),
    };
  }
}
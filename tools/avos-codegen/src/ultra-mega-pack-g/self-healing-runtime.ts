import { randomUUID } from "node:crypto";
import {
  UltraGEvidence,
  UltraGFinding,
  UltraGSeverity,
} from "./contracts";

export interface RuntimeFault {
  key: string;
  component: string;
  severity: UltraGSeverity;
  recoverable: boolean;
  retryCount: number;
}

export interface RecoveryAction {
  key: string;
  component: string;
  strategy: "restart" | "failover" | "rollback" | "isolate" | "manual";
  success: boolean;
}

export interface SelfHealingResult {
  recovered: number;
  failed: number;
  actions: RecoveryAction[];
  findings: UltraGFinding[];
  evidence: UltraGEvidence[];
  completedAt: string;
}

export class SelfHealingRuntime {
  heal(
    systemKey: string,
    faults: readonly RuntimeFault[],
  ): SelfHealingResult {
    const actions: RecoveryAction[] = [];
    const findings: UltraGFinding[] = [];

    for (const fault of faults) {
      const strategy: RecoveryAction["strategy"] =
        !fault.recoverable
          ? "manual"
          : fault.severity === UltraGSeverity.CRITICAL
            ? "failover"
            : fault.retryCount >= 3
              ? "rollback"
              : "restart";

      const success = strategy !== "manual";

      actions.push({
        key: `recover-${fault.key}`,
        component: fault.component,
        strategy,
        success,
      });

      if (!success) {
        findings.push({
          code: "SELF_HEALING_MANUAL_INTERVENTION_REQUIRED",
          severity: fault.severity,
          message: `Fault ${fault.key} requires manual intervention.`,
          subject: fault.component,
          metadata: {
            recoverable: fault.recoverable,
            retryCount: fault.retryCount,
          },
        });
      }
    }

    const recovered = actions.filter((action) => action.success).length;
    const failed = actions.length - recovered;

    return {
      recovered,
      failed,
      actions,
      findings,
      evidence: [
        {
          id: randomUUID(),
          systemKey,
          category: "self-healing-runtime",
          action: "recovery.completed",
          message: `Recovered ${recovered} faults; ${failed} remain unresolved.`,
          metadata: {
            recovered,
            failed,
            strategies: actions.map((action) => action.strategy),
          },
          createdAt: new Date().toISOString(),
        },
      ],
      completedAt: new Date().toISOString(),
    };
  }
}

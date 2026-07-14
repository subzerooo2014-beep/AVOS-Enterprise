import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { EnterpriseSignalDetectionService } from "./enterprise-signal-detection.service";
import {
  EnterpriseRiskLevel,
  EnterpriseScenario,
} from "./enterprise-e8.types";

@Injectable()
export class EnterpriseScenarioSimulatorService {
  private readonly scenarios: EnterpriseScenario[] = [];

  constructor(
    private readonly signals: EnterpriseSignalDetectionService,
  ) {}

  simulate(name = "Runtime stress scenario"): EnterpriseScenario {
    const signal =
      this.signals.latest() ||
      this.signals.detect({
        domain: "enterprise-runtime",
        metric: "operational-pressure",
        value: 76,
        threshold: 70,
      });

    const probability = Math.min(
      99,
      Math.max(10, Math.round((signal.value / Math.max(1, signal.threshold)) * 60)),
    );
    const impactScore = Math.min(
      100,
      Math.max(1, Math.round(probability * (signal.severity === "CRITICAL" ? 1 : 0.8))),
    );
    const riskLevel: EnterpriseRiskLevel =
      impactScore >= 85
        ? "CRITICAL"
        : impactScore >= 65
          ? "HIGH"
          : impactScore >= 40
            ? "MEDIUM"
            : "LOW";

    const scenario: EnterpriseScenario = {
      id: randomUUID(),
      name,
      domain: signal.domain,
      probability,
      impactScore,
      riskLevel,
      recommendedAction:
        riskLevel === "CRITICAL"
          ? "activate-enterprise-containment"
          : riskLevel === "HIGH"
            ? "activate-preventive-mitigation"
            : riskLevel === "MEDIUM"
              ? "increase-monitoring-and-capacity"
              : "maintain-current-controls",
      simulatedAt: new Date().toISOString(),
    };

    this.scenarios.push(scenario);
    return scenario;
  }

  list(): EnterpriseScenario[] {
    return [...this.scenarios];
  }

  count(): number {
    return this.scenarios.length;
  }
}
import { Injectable } from "@nestjs/common";
import { CapabilityRegistryService } from "../capability-fabric/capability-registry.service";
import { CapabilityUsageAnalyticsService } from "./capability-usage-analytics.service";
import { CapabilityRiskSignal } from "./capability-intelligence.types";

@Injectable()
export class CapabilityRiskService {
  constructor(
    private readonly registry: CapabilityRegistryService,
    private readonly usage: CapabilityUsageAnalyticsService,
  ) {}

  assess(capabilityKey: string): CapabilityRiskSignal[] {
    const capability = this.registry.get(capabilityKey);
    if (!capability) {
      throw new Error(`Capability not found: ${capabilityKey}`);
    }

    const usage = this.usage.profile(capabilityKey);
    const risks: CapabilityRiskSignal[] = [];

    if (usage.successRate < 95) {
      risks.push({
        code: "CFI_RUNTIME_FAILURE_RATE",
        severity: usage.successRate < 80 ? "CRITICAL" : "HIGH",
        message: "Capability runtime success rate is below target.",
        evidence: { successRate: usage.successRate },
      });
    }

    if (capability.dependencies.length > 8) {
      risks.push({
        code: "CFI_DEPENDENCY_COMPLEXITY",
        severity: "HIGH",
        message: "Capability has a high dependency count.",
        evidence: { dependencyCount: capability.dependencies.length },
      });
    }

    if (capability.metrics.length === 0) {
      risks.push({
        code: "CFI_MISSING_METRICS",
        severity: "HIGH",
        message: "Capability has no operational metrics.",
        evidence: {},
      });
    }

    if (
      !capability.health.healthEndpoint &&
      !capability.health.readinessEndpoint
    ) {
      risks.push({
        code: "CFI_MISSING_HEALTH",
        severity: "HIGH",
        message: "Capability has no health or readiness endpoint.",
        evidence: {},
      });
    }

    if (!capability.documentationRef) {
      risks.push({
        code: "CFI_DOCUMENTATION_GAP",
        severity: "MEDIUM",
        message: "Capability documentation reference is missing.",
        evidence: {},
      });
    }

    if (capability.policies.length === 0) {
      risks.push({
        code: "CFI_GOVERNANCE_GAP",
        severity: "MEDIUM",
        message: "Capability has no policy bindings.",
        evidence: {},
      });
    }

    if (
      capability.security.classification !== "PUBLIC" &&
      !capability.security.authenticationRequired
    ) {
      risks.push({
        code: "CFI_AUTHENTICATION_GAP",
        severity: "CRITICAL",
        message: "Non-public capability does not require authentication.",
        evidence: {
          classification: capability.security.classification,
        },
      });
    }

    return risks;
  }
}
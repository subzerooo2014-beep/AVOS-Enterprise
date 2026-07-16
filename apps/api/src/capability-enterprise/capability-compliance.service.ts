import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { CapabilityRegistryService } from "../capability-fabric/capability-registry.service";
import { CapabilityIntelligenceService } from "../capability-intelligence/capability-intelligence.service";
import { CapabilityComplianceEvaluation } from "./capability-enterprise.types";

@Injectable()
export class CapabilityComplianceService {
  private readonly evaluations = new Map<
    string,
    CapabilityComplianceEvaluation
  >();

  constructor(
    private readonly registry: CapabilityRegistryService,
    private readonly intelligence: CapabilityIntelligenceService,
  ) {}

  evaluate(capabilityKey: string, evaluatedBy: string) {
    const capability = this.registry.get(capabilityKey);
    if (!capability) {
      return { success: false, reason: "CAPABILITY_NOT_REGISTERED" };
    }

    const insight =
      this.intelligence.getLatest(capabilityKey) ??
      this.intelligence.analyze(capabilityKey);

    const controls = [
      capability.security.authenticationRequired,
      capability.security.authorizationRequired,
      capability.metrics.length > 0,
      Boolean(
        capability.health.healthEndpoint ||
          capability.health.readinessEndpoint,
      ),
      capability.policies.length > 0,
      capability.identity.owner.length > 0,
      capability.versionHistory.length > 0,
      insight.score.trustScore >= 65,
      insight.score.qualityIndex >= 65,
      insight.score.riskScore <= 45,
    ];

    const passed = controls.filter(Boolean).length;
    const score = (passed / controls.length) * 100;
    const status =
      score >= 90
        ? "COMPLIANT"
        : score >= 65
          ? "PARTIALLY_COMPLIANT"
          : "NON_COMPLIANT";

    const evaluation: CapabilityComplianceEvaluation = {
      id: randomUUID(),
      capabilityKey: capability.identity.key,
      status,
      score,
      controlsEvaluated: controls.length,
      controlsPassed: passed,
      findings: [
        ...(capability.policies.length === 0
          ? ["Missing policy bindings"]
          : []),
        ...(capability.metrics.length === 0
          ? ["Missing operational metrics"]
          : []),
        ...(insight.score.trustScore < 65 ? ["Trust score below target"] : []),
        ...(insight.score.riskScore > 45 ? ["Risk score above ceiling"] : []),
      ],
      evidence: {
        qualityIndex: insight.score.qualityIndex,
        trustScore: insight.score.trustScore,
        riskScore: insight.score.riskScore,
      },
      evaluatedBy,
      evaluatedAt: new Date().toISOString(),
    };

    this.evaluations.set(capability.identity.key, evaluation);
    return { success: true, evaluation: structuredClone(evaluation) };
  }

  get(capabilityKey: string) {
    const evaluation = this.evaluations.get(capabilityKey.toLowerCase());
    return evaluation ? structuredClone(evaluation) : null;
  }

  list() {
    return [...this.evaluations.values()].map((evaluation) =>
      structuredClone(evaluation),
    );
  }
}
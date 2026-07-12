import { randomUUID } from "node:crypto";
import {
  UltraCDecision,
  UltraCEvidence,
  UltraCFinding,
  UltraCSeverity,
} from "../contracts";
import {
  GenesisFactoryInput,
  GenesisFactoryResult,
} from "./contracts";

export class GenesisAutonomousFactory {
  execute(input: GenesisFactoryInput): GenesisFactoryResult {
    const findings: UltraCFinding[] = [
      ...input.optimization.findings,
      ...input.integration.findings,
    ];

    const controls = new Set<string>();

    if (input.design.unresolvedCapabilities.length > 0) {
      controls.add("capability-resolution");
      findings.push({
        code: "UNRESOLVED_ENTERPRISE_CAPABILITIES",
        severity: UltraCSeverity.ERROR,
        message:
          "Enterprise design contains unresolved capabilities.",
        metadata: {
          count: input.design.unresolvedCapabilities.length,
        },
      });
    }

    if (input.integration.unresolvedCapabilities.length > 0) {
      controls.add("integration-remediation");
    }

    const score = Math.round(
      (input.optimization.scoreAfter +
        (input.design.unresolvedCapabilities.length === 0 ? 100 : 50) +
        (input.integration.unresolvedCapabilities.length === 0 ? 100 : 50) +
        (input.knowledge.records.length > 0 ? 100 : 60)) /
        4,
    );

    const hasCritical = findings.some(
      (finding) => finding.severity === UltraCSeverity.CRITICAL,
    );

    const hasErrors = findings.some(
      (finding) => finding.severity === UltraCSeverity.ERROR,
    );

    let decision: UltraCDecision;

    if (hasCritical || score < 40) {
      decision = UltraCDecision.REJECT;
    } else if (hasErrors || score < 65) {
      decision = UltraCDecision.REQUIRE_REVIEW;
    } else if (controls.size > 0) {
      decision = UltraCDecision.APPROVE_WITH_CONTROLS;
    } else {
      decision = UltraCDecision.APPROVE;
    }

    const approved =
      decision === UltraCDecision.APPROVE ||
      decision === UltraCDecision.APPROVE_WITH_CONTROLS;

    const evidence: UltraCEvidence[] = [
      {
        id: randomUUID(),
        systemKey: input.systemKey,
        category: "genesis-factory",
        action: "factory.completed",
        message:
          `Genesis autonomous factory completed with decision ${decision}.`,
        metadata: {
          score,
          approved,
          designComponents: input.design.components.length,
          optimizationActions: input.optimization.actions.length,
          integrationRoutes: input.integration.routes.length,
          knowledgeRecords: input.knowledge.records.length,
        },
        createdAt: new Date().toISOString(),
      },
    ];

    return {
      success: approved,
      decision,
      score,
      controls: Array.from(controls),
      findings,
      evidence,
      completedAt: new Date().toISOString(),
    };
  }
}

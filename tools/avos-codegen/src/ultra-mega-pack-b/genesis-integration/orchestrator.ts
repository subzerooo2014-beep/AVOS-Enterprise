import { randomUUID } from "node:crypto";
import {
  UltraBDecision,
  UltraBEvidence,
  UltraBFinding,
  UltraBSeverity,
} from "../contracts";
import {
  GenesisIntegrationInput,
  GenesisIntegrationResult,
} from "./contracts";

export class FullGenesisEngineIntegrationOrchestrator {
  integrate(
    input: GenesisIntegrationInput,
  ): GenesisIntegrationResult {
    const findings: UltraBFinding[] = [
      ...input.runtime.findings,
      ...input.testing.executions.flatMap(
        (execution) => execution.findings,
      ),
      ...input.security.findings,
    ];

    const controls =
      new Set<string>(
        input.security.requiredControls,
      );

    if (!input.runtime.healthy) {
      controls.add("runtime-remediation");
    }

    if (!input.testing.passed) {
      controls.add("testing-remediation");
    }

    if (
      input.twinDiff.removed.length > 0 ||
      input.twinDiff.changed.length > 10
    ) {
      controls.add("digital-twin-review");
    }

    const score =
      Math.round(
        (
          input.runtime.score +
          input.testing.score +
          input.security.score
        ) / 3,
      );

    const hasCritical =
      findings.some(
        (finding) =>
          finding.severity === UltraBSeverity.CRITICAL,
      );

    const hasErrors =
      findings.some(
        (finding) =>
          finding.severity === UltraBSeverity.ERROR,
      );

    let decision: UltraBDecision;

    if (hasCritical || score < 40) {
      decision = UltraBDecision.REJECT;
    }
    else if (hasErrors || score < 65) {
      decision = UltraBDecision.REQUIRE_REVIEW;
    }
    else if (controls.size > 0) {
      decision = UltraBDecision.APPROVE_WITH_CONTROLS;
    }
    else {
      decision = UltraBDecision.APPROVE;
    }

    const approved =
      decision === UltraBDecision.APPROVE ||
      decision === UltraBDecision.APPROVE_WITH_CONTROLS;

    const evidence: UltraBEvidence[] = [
      {
        id: randomUUID(),
        systemKey: input.systemKey,
        category: "genesis-integration",
        action: "integration.completed",
        message:
          `Genesis integration completed with decision ${decision}.`,
        metadata: {
          score,
          approved,
          runtimeScore: input.runtime.score,
          testingScore: input.testing.score,
          securityScore: input.security.score,
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

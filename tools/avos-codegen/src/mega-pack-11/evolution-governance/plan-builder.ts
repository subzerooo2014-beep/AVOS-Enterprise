import { randomUUID } from "node:crypto";
import {
  EvolutionExecutionPlan,
  EvolutionExecutionStep,
  EvolutionPolicyDecision,
  EvolutionProposal,
} from "./contracts";

export class EvolutionExecutionPlanBuilder {
  build(
    proposal: EvolutionProposal,
    decision: EvolutionPolicyDecision,
  ): EvolutionExecutionPlan {
    if (!decision.approved) {
      throw new Error(
        "Cannot build an execution plan for a rejected proposal.",
      );
    }

    const steps:
      EvolutionExecutionStep[] = [
        this.step(
          "capture-baseline",
          "Capture Baseline",
          "Capture source, configuration, schema, and runtime baselines.",
          10,
          [],
          decision.controls,
        ),
        this.step(
          "validate-dependencies",
          "Validate Dependencies",
          "Validate proposal and blueprint dependencies.",
          20,
          ["capture-baseline"],
          decision.controls,
        ),
        this.step(
          "generate-change-set",
          "Generate Change Set",
          "Generate deterministic source and configuration changes.",
          30,
          ["validate-dependencies"],
          decision.controls,
        ),
        this.step(
          "run-quality-gates",
          "Run Quality Gates",
          "Run type checking, tests, policy checks, and integrity checks.",
          40,
          ["generate-change-set"],
          decision.controls,
        ),
        this.step(
          "commit-change-set",
          "Commit Change Set",
          "Commit the approved change set with evidence and traceability.",
          50,
          ["run-quality-gates"],
          decision.controls,
        ),
      ];

    const rollbackSteps:
      EvolutionExecutionStep[] = [
        this.step(
          "restore-baseline",
          "Restore Baseline",
          "Restore the captured source and configuration baseline.",
          10,
          [],
          decision.controls,
        ),
        this.step(
          "validate-restoration",
          "Validate Restoration",
          "Verify that restored runtime and source integrity are healthy.",
          20,
          ["restore-baseline"],
          decision.controls,
        ),
      ];

    return {
      proposalId: proposal.id,
      decision: decision.decision,
      steps,
      rollbackSteps,
      generatedAt:
        new Date().toISOString(),
    };
  }

  private step(
    key: string,
    name: string,
    description: string,
    order: number,
    dependencies: string[],
    controls:
      EvolutionPolicyDecision["controls"],
  ): EvolutionExecutionStep {
    return {
      id: randomUUID(),
      key,
      name,
      description,
      order,
      dependencies,
      controls:
        structuredClone(controls),
      metadata: {},
    };
  }
}

import {
  UltraFinding,
  UltraSeverity,
} from "../contracts";
import {
  AutonomousGenerationRequest,
  AutonomousGenerationResult,
} from "./contracts";
import {
  AutonomousArtifactGenerator,
} from "./generator";
import {
  AutonomousCodeGenerationPlanner,
} from "./planner";

export class AutonomousCodeGenerationOrchestrator {
  readonly planner =
    new AutonomousCodeGenerationPlanner();

  readonly generator =
    new AutonomousArtifactGenerator();

  execute(
    request: AutonomousGenerationRequest,
  ): AutonomousGenerationResult {
    const plan =
      this.planner.plan(request);

    const findings:
      UltraFinding[] = [];

    if (
      request.requirements.length === 0
    ) {
      findings.push({
        code:
          "NO_GENERATION_REQUIREMENTS",
        severity:
          UltraSeverity.ERROR,
        message:
          "Generation request contains no requirements.",
        metadata: {},
      });
    }

    const artifacts =
      findings.length === 0
        ? this.generator.generate(
            request,
          )
        : [];

    return {
      success:
        findings.length === 0,
      request:
        structuredClone(request),
      plan,
      artifacts,
      findings,
      completedAt:
        new Date().toISOString(),
    };
  }
}

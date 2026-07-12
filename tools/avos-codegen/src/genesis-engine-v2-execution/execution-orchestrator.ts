import { randomUUID } from "node:crypto";
import {
  ExecutionArtifactKind,
  ExecutionEvidence,
  ExecutionFinding,
  ExecutionSeverity,
  ExecutionStatus,
  GeneratedArtifact,
} from "./contracts";
import {
  ExecutableDomainModule,
  ModuleSourceGenerator,
} from "./module-generator";
import {
  ExecutableSystemBlueprint,
  SystemSourceGenerator,
} from "./system-generator";
import {
  WorkspaceExecutionPlan,
  WorkspaceWriterPlanner,
} from "./workspace-writer";

export interface GenesisExecutionInput {
  blueprint: ExecutableSystemBlueprint;
  outputDirectory: string;
  overwrite?: boolean;
}

export interface GenesisGenerationExecutionResult {
  success: boolean;
  status: ExecutionStatus;
  score: number;
  artifacts: GeneratedArtifact[];
  workspacePlan: WorkspaceExecutionPlan;
  validationCommands: string[];
  findings: ExecutionFinding[];
  evidence: ExecutionEvidence[];
  completedAt: string;
}

export class GenesisExecutionOrchestrator {
  constructor(
    readonly moduleGenerator = new ModuleSourceGenerator(),
    readonly systemGenerator = new SystemSourceGenerator(),
    readonly workspacePlanner = new WorkspaceWriterPlanner(),
  ) {}

  execute(input: GenesisExecutionInput): GenesisGenerationExecutionResult {
    const artifacts: GeneratedArtifact[] = [];

    for (const module of input.blueprint.modules) {
      artifacts.push(
        ...this.moduleGenerator.generate(
          module as ExecutableDomainModule,
        ),
      );
    }

    artifacts.push(...this.systemGenerator.generate(input.blueprint));

    const workspacePlan = this.workspacePlanner.plan(
      input.outputDirectory,
      artifacts,
      input.overwrite ?? false,
    );

    const findings: ExecutionFinding[] = [];
    const duplicatePaths = artifacts
      .map((artifact) => artifact.relativePath)
      .filter(
        (path, index, all) => all.indexOf(path) !== index,
      );

    if (duplicatePaths.length > 0) {
      findings.push({
        code: "GENESIS_EXECUTION_DUPLICATE_ARTIFACT_PATHS",
        severity: ExecutionSeverity.ERROR,
        message: "Duplicate artifact paths were generated.",
        metadata: {
          paths: Array.from(new Set(duplicatePaths)),
        },
      });
    }

    const requiredKinds = [
      ExecutionArtifactKind.MODULE,
      ExecutionArtifactKind.CONTROLLER,
      ExecutionArtifactKind.SERVICE,
      ExecutionArtifactKind.DTO,
      ExecutionArtifactKind.TEST,
      ExecutionArtifactKind.DOCUMENTATION,
      ExecutionArtifactKind.REGISTRATION,
    ];

    for (const kind of requiredKinds) {
      if (!artifacts.some((artifact) => artifact.kind === kind)) {
        findings.push({
          code: "GENESIS_EXECUTION_ARTIFACT_KIND_MISSING",
          severity: ExecutionSeverity.ERROR,
          message: `Required artifact kind ${kind} was not generated.`,
          subject: kind,
          metadata: {},
        });
      }
    }

    const integrityScore =
      artifacts.length === 0
        ? 0
        : Math.round(
            (artifacts.filter(
              (artifact) =>
                artifact.hash.length === 64 &&
                artifact.content.trim().length > 0,
            ).length /
              artifacts.length) *
              100,
          );

    const coverageScore = Math.min(
      100,
      Math.round(
        (artifacts.length /
          Math.max(1, input.blueprint.modules.length * 6 + 5)) *
          100,
      ),
    );

    const score = Math.round(
      (integrityScore + coverageScore + 100) / 3,
    );

    const hasCritical = findings.some(
      (finding) => finding.severity === ExecutionSeverity.CRITICAL,
    );
    const hasErrors = findings.some(
      (finding) => finding.severity === ExecutionSeverity.ERROR,
    );

    const status = hasCritical
      ? ExecutionStatus.BLOCKED
      : hasErrors || score < 75
        ? ExecutionStatus.DEGRADED
        : ExecutionStatus.READY;

    return {
      success: status === ExecutionStatus.READY,
      status,
      score,
      artifacts,
      workspacePlan,
      validationCommands: [
        "pnpm install",
        "pnpm build",
        "pnpm test",
        "pnpm lint",
      ],
      findings,
      evidence: [
        {
          id: randomUUID(),
          category: "genesis-engine-v2-execution",
          action: "generation.execution-planned",
          message: `Planned ${artifacts.length} generated artifacts.`,
          metadata: {
            status,
            score,
            modules: input.blueprint.modules.length,
            artifactCount: artifacts.length,
            outputDirectory: input.outputDirectory,
            integrityScore,
            coverageScore,
          },
          createdAt: new Date().toISOString(),
        },
      ],
      completedAt: new Date().toISOString(),
    };
  }
}

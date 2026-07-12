import { randomUUID } from "node:crypto";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import {
  GenesisPipelineEvidence,
  GenesisPipelineFinding,
  GenesisPipelineStage,
  GenesisPipelineStatus,
} from "./contracts";
import {
  GenesisEngineV2,
  SystemIntent,
} from "../genesis-engine-v2";
import {
  GenesisExecutionOrchestrator,
} from "../genesis-engine-v2-execution";
import {
  WorkspaceExecutionMode,
  WorkspaceMaterializer,
} from "../genesis-engine-v2-workspace";
import {
  GenesisValidationOrchestrator,
  ValidationGateDefinition,
} from "../genesis-engine-v2-validation";
import {
  GenesisReleaseOrchestrator,
  ReleaseArtifactDescriptor,
  ReleaseBump,
} from "../genesis-engine-v2-release";

export interface GenesisEndToEndInput {
  intent: SystemIntent;
  outputDirectory: string;
  validationGates: ValidationGateDefinition[];
  currentVersion: string;
  versionBump: ReleaseBump;
  previousVersion?: string | null;
  overwrite?: boolean;
}

export interface GenesisEndToEndResult {
  success: boolean;
  status: GenesisPipelineStatus;
  failedStage: GenesisPipelineStage | null;
  blueprintScore: number;
  generationScore: number;
  validationScore: number;
  releaseVersion: string | null;
  artifacts: number;
  findings: GenesisPipelineFinding[];
  evidence: GenesisPipelineEvidence[];
  completedAt: string;
}

export class GenesisEndToEndOrchestrator {
  constructor(
    readonly blueprintEngine = new GenesisEngineV2(),
    readonly executionEngine = new GenesisExecutionOrchestrator(),
    readonly workspaceEngine = new WorkspaceMaterializer(),
    readonly validationEngine = new GenesisValidationOrchestrator(),
    readonly releaseEngine = new GenesisReleaseOrchestrator(),
  ) {}

  async execute(input: GenesisEndToEndInput): Promise<GenesisEndToEndResult> {
    const findings: GenesisPipelineFinding[] = [];
    const evidence: GenesisPipelineEvidence[] = [];

    const blueprint = this.blueprintEngine.execute(input.intent);

    evidence.push({
      id: randomUUID(),
      stage: GenesisPipelineStage.BLUEPRINT,
      action: "blueprint.completed",
      message: `Blueprint stage completed with status ${blueprint.status}.`,
      metadata: {
        score: blueprint.score,
        modules: blueprint.blueprint.domains.modules.length,
      },
      createdAt: new Date().toISOString(),
    });

    if (!blueprint.success) {
      findings.push({
        code: "GENESIS_E2E_BLUEPRINT_FAILED",
        stage: GenesisPipelineStage.BLUEPRINT,
        message: "Blueprint generation failed.",
        metadata: { score: blueprint.score },
      });

      return this.fail(
        GenesisPipelineStage.BLUEPRINT,
        blueprint.score,
        0,
        0,
        findings,
        evidence,
      );
    }

    const generated = this.executionEngine.execute({
      outputDirectory: input.outputDirectory,
      overwrite: input.overwrite ?? false,
      blueprint: {
        systemKey: blueprint.blueprint.intent.systemKey,
        systemName: input.intent.name,
        architectureStyle: blueprint.blueprint.architecture.style,
        modules: blueprint.blueprint.domains.modules.map((module) => ({
          key: module.key,
          responsibilities: module.responsibilities,
          dependencies: module.dependencies,
        })),
        validationGates: blueprint.blueprint.validationGates,
        documentationPlan: blueprint.blueprint.documentationPlan,
        brainRegistrations:
          blueprint.blueprint.enterpriseBrainRegistration,
        evolutionRegistrations:
          blueprint.blueprint.evolutionCenterRegistration,
      },
    });

    evidence.push({
      id: randomUUID(),
      stage: GenesisPipelineStage.GENERATION,
      action: "generation.completed",
      message: `Generation stage produced ${generated.artifacts.length} artifacts.`,
      metadata: {
        score: generated.score,
        artifacts: generated.artifacts.length,
      },
      createdAt: new Date().toISOString(),
    });

    if (!generated.success) {
      findings.push({
        code: "GENESIS_E2E_GENERATION_FAILED",
        stage: GenesisPipelineStage.GENERATION,
        message: "Artifact generation failed.",
        metadata: { score: generated.score },
      });

      return this.fail(
        GenesisPipelineStage.GENERATION,
        blueprint.score,
        generated.score,
        0,
        findings,
        evidence,
      );
    }

    await mkdir(input.outputDirectory, { recursive: true });

    const workspace = await this.workspaceEngine.execute({
      rootDirectory: input.outputDirectory,
      mode: WorkspaceExecutionMode.APPLY,
      artifacts: generated.artifacts.map((artifact) => ({
        relativePath: artifact.relativePath,
        content: artifact.content,
        hash: artifact.hash,
        overwrite: input.overwrite ?? false,
      })),
    });

    evidence.push({
      id: randomUUID(),
      stage: GenesisPipelineStage.WORKSPACE,
      action: "workspace.completed",
      message: `Workspace stage completed with ${workspace.operations.length} operations.`,
      metadata: {
        status: workspace.status,
        operations: workspace.operations.length,
      },
      createdAt: new Date().toISOString(),
    });

    if (!workspace.success) {
      findings.push({
        code: "GENESIS_E2E_WORKSPACE_FAILED",
        stage: GenesisPipelineStage.WORKSPACE,
        message: "Workspace materialization failed.",
        metadata: {
          operations: workspace.operations.length,
        },
      });

      return this.fail(
        GenesisPipelineStage.WORKSPACE,
        blueprint.score,
        generated.score,
        0,
        findings,
        evidence,
      );
    }

    const validation = await this.validationEngine.execute({
      workspaceDirectory: input.outputDirectory,
      gates: input.validationGates,
      stopOnRequiredFailure: true,
    });

    evidence.push({
      id: randomUUID(),
      stage: GenesisPipelineStage.VALIDATION,
      action: "validation.completed",
      message: `Validation completed with quality score ${validation.promotion.qualityScore}.`,
      metadata: {
        qualityScore: validation.promotion.qualityScore,
        strategy: validation.promotion.strategy,
      },
      createdAt: new Date().toISOString(),
    });

    if (!validation.success) {
      await this.workspaceEngine.rollback(workspace.rollbackManifest);

      findings.push({
        code: "GENESIS_E2E_VALIDATION_FAILED",
        stage: GenesisPipelineStage.VALIDATION,
        message: "Validation failed and workspace rollback was executed.",
        metadata: {
          qualityScore: validation.promotion.qualityScore,
        },
      });

      return this.fail(
        GenesisPipelineStage.VALIDATION,
        blueprint.score,
        generated.score,
        validation.promotion.qualityScore,
        findings,
        evidence,
      );
    }

    const releaseArtifacts: ReleaseArtifactDescriptor[] = [];

    for (const artifact of generated.artifacts) {
      const absolutePath = path.resolve(
        input.outputDirectory,
        artifact.relativePath,
      );
      const content = await readFile(absolutePath);

      releaseArtifacts.push({
        relativePath: artifact.relativePath,
        hash: artifact.hash,
        kind: artifact.kind,
        sizeBytes: content.byteLength,
      });
    }

    const release = this.releaseEngine.execute({
      systemKey: input.intent.systemKey,
      currentVersion: input.currentVersion,
      bump: input.versionBump,
      workspaceDirectory: input.outputDirectory,
      architectureStyle: blueprint.blueprint.architecture.style,
      capabilities: blueprint.blueprint.domains.modules.map(
        (module) => module.key,
      ),
      artifacts: releaseArtifacts,
      promotion: {
        approved: validation.promotion.approved,
        strategy: validation.promotion.strategy,
        qualityScore: validation.promotion.qualityScore,
        controls: validation.promotion.controls,
      },
      previousVersion: input.previousVersion ?? null,
    });

    evidence.push({
      id: randomUUID(),
      stage: GenesisPipelineStage.RELEASE,
      action: "release.completed",
      message: `Release stage completed with version ${release.releaseVersion ?? "none"}.`,
      metadata: {
        releaseVersion: release.releaseVersion,
        status: release.status,
      },
      createdAt: new Date().toISOString(),
    });

    if (!release.success) {
      await this.workspaceEngine.rollback(workspace.rollbackManifest);

      findings.push({
        code: "GENESIS_E2E_RELEASE_FAILED",
        stage: GenesisPipelineStage.RELEASE,
        message: "Release failed and workspace rollback was executed.",
        metadata: {},
      });

      return this.fail(
        GenesisPipelineStage.RELEASE,
        blueprint.score,
        generated.score,
        validation.promotion.qualityScore,
        findings,
        evidence,
      );
    }

    return {
      success: true,
      status: GenesisPipelineStatus.READY,
      failedStage: null,
      blueprintScore: blueprint.score,
      generationScore: generated.score,
      validationScore: validation.promotion.qualityScore,
      releaseVersion: release.releaseVersion,
      artifacts: generated.artifacts.length,
      findings,
      evidence,
      completedAt: new Date().toISOString(),
    };
  }

  private fail(
    failedStage: GenesisPipelineStage,
    blueprintScore: number,
    generationScore: number,
    validationScore: number,
    findings: GenesisPipelineFinding[],
    evidence: GenesisPipelineEvidence[],
  ): GenesisEndToEndResult {
    return {
      success: false,
      status: GenesisPipelineStatus.BLOCKED,
      failedStage,
      blueprintScore,
      generationScore,
      validationScore,
      releaseVersion: null,
      artifacts: 0,
      findings,
      evidence,
      completedAt: new Date().toISOString(),
    };
  }
}

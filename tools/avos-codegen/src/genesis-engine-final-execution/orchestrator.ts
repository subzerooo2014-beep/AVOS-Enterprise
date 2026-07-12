import {
  GenesisV3FirstSystemOrchestrator,
} from "../genesis-engine-v3-first-system";
import {
  GenesisV3SystemMaterializer,
} from "../genesis-engine-v3-materialization";
import {
  GenesisV3RuntimeValidationOrchestrator,
} from "../genesis-engine-v3-runtime-validation";
import {
  GenesisReleaseOrchestrator,
} from "../genesis-engine-v2-release";
import {
  GenesisFinalExecutionInput,
  GenesisFinalExecutionResult,
} from "./contracts";

export class GenesisFinalExecutionOrchestrator {
  constructor(
    readonly generator = new GenesisV3FirstSystemOrchestrator(),
    readonly materializer = new GenesisV3SystemMaterializer(),
    readonly validator = new GenesisV3RuntimeValidationOrchestrator(),
    readonly releaser = new GenesisReleaseOrchestrator(),
  ) {}

  async execute(
    input: GenesisFinalExecutionInput,
  ): Promise<GenesisFinalExecutionResult> {
    const startedAt = Date.now();

    const generated = this.generator.execute(input.specification);

    const baseReport = {
      systemKey: input.specification.systemKey,
      systemName: input.specification.systemName,
      outputDirectory: input.outputDirectory,
      generatedArtifacts: generated.artifacts.length,
      materializedOperations: 0,
      validationCommands: 0,
      qualityScore: 0,
      runtimeReady: false,
      releaseVersion: null as string | null,
      enterpriseBrainRegistered: false,
      evolutionCenterRegistered: false,
      blueprintRegistryRegistered: false,
      artifactRegistryEntries: 0,
      rollbackExecuted: false,
      replayManifestCreated: false,
      durationMs: 0,
    };

    if (!generated.success) {
      return {
        success: false,
        stage: "generation",
        artifacts: generated.artifacts,
        report: {
          ...baseReport,
          durationMs: Date.now() - startedAt,
        },
        replayManifest: {},
        artifactRegistry: [],
        completedAt: new Date().toISOString(),
      };
    }

    const materialized = await this.materializer.execute({
      rootDirectory: input.outputDirectory,
      artifacts: generated.artifacts.map((artifact) => ({
        relativePath: artifact.relativePath,
        content: artifact.content,
        hash: artifact.hash,
        overwrite: input.overwrite ?? false,
      })),
    });

    if (!materialized.success) {
      return {
        success: false,
        stage: "materialization",
        artifacts: generated.artifacts,
        report: {
          ...baseReport,
          materializedOperations: materialized.operations.length,
          durationMs: Date.now() - startedAt,
        },
        replayManifest: {},
        artifactRegistry: [],
        completedAt: new Date().toISOString(),
      };
    }

    const validation = await this.validator.execute({
      workspaceDirectory: input.outputDirectory,
      stopOnRequiredFailure: true,
      commands: [
        {
          key: "environment",
          command: "node --version",
          required: true,
          timeoutMs: 30000,
          weight: 10,
        },
        {
          key: "install",
          command: "pnpm install",
          required: true,
          timeoutMs: 300000,
          weight: 20,
        },
        {
          key: "build",
          command: "pnpm run build",
          required: true,
          timeoutMs: 180000,
          weight: 25,
        },
        {
          key: "test",
          command: "pnpm run test",
          required: true,
          timeoutMs: 180000,
          weight: 20,
        },
        {
          key: "lint",
          command: "pnpm run lint",
          required: true,
          timeoutMs: 180000,
          weight: 15,
        },
        {
          key: "smoke",
          command: "pnpm run smoke",
          required: true,
          timeoutMs: 180000,
          weight: 10,
        },
      ],
    });

    if (!validation.success) {
      await this.materializer.rollback(
        input.outputDirectory,
        materialized.rollbackEntries,
      );

      return {
        success: false,
        stage: "validation",
        artifacts: generated.artifacts,
        report: {
          ...baseReport,
          materializedOperations: materialized.operations.length,
          validationCommands: validation.commandResults.length,
          qualityScore: validation.qualityScore,
          rollbackExecuted: true,
          durationMs: Date.now() - startedAt,
        },
        replayManifest: {},
        artifactRegistry: [],
        completedAt: new Date().toISOString(),
      };
    }

    const release = this.releaser.execute({
      systemKey: input.specification.systemKey,
      currentVersion: input.currentVersion,
      bump: input.versionBump,
      workspaceDirectory: input.outputDirectory,
      architectureStyle: "full-stack-generated-system",
      capabilities: input.specification.domains.map(
        (domain) => domain.key,
      ),
      artifacts: generated.artifacts.map((artifact) => ({
        relativePath: artifact.relativePath,
        hash: artifact.hash,
        kind: artifact.kind,
        sizeBytes: Buffer.byteLength(artifact.content, "utf8"),
      })),
      promotion: {
        approved: true,
        strategy:
          validation.qualityScore >= 90
            ? "promote"
            : "promote-with-controls",
        qualityScore: validation.qualityScore,
        controls:
          validation.qualityScore >= 90
            ? ["continuous-observability"]
            : [
                "progressive-promotion",
                "automatic-rollback",
                "continuous-observability",
              ],
      },
      previousVersion: input.previousVersion ?? null,
    });

    if (!release.success) {
      await this.materializer.rollback(
        input.outputDirectory,
        materialized.rollbackEntries,
      );

      return {
        success: false,
        stage: "release",
        artifacts: generated.artifacts,
        report: {
          ...baseReport,
          materializedOperations: materialized.operations.length,
          validationCommands: validation.commandResults.length,
          qualityScore: validation.qualityScore,
          runtimeReady: validation.runtimeReady,
          rollbackExecuted: true,
          durationMs: Date.now() - startedAt,
        },
        replayManifest: {},
        artifactRegistry: [],
        completedAt: new Date().toISOString(),
      };
    }

    const artifactRegistry = generated.artifacts.map((artifact) => ({
      relativePath: artifact.relativePath,
      hash: artifact.hash,
      kind: artifact.kind,
    }));

    const replayManifest = {
      systemKey: input.specification.systemKey,
      specification: input.specification,
      outputDirectory: input.outputDirectory,
      releaseVersion: release.releaseVersion,
      artifactRegistry,
      validation: {
        qualityScore: validation.qualityScore,
        runtimeReady: validation.runtimeReady,
        commands: validation.commandResults.map((item) => ({
          key: item.key,
          status: item.status,
          exitCode: item.exitCode,
        })),
      },
      replayedWith: "genesis-engine-final-execution@3.3.2",
    };

    return {
      success: true,
      stage: "completed",
      artifacts: generated.artifacts,
      report: {
        ...baseReport,
        materializedOperations: materialized.operations.length,
        validationCommands: validation.commandResults.length,
        qualityScore: validation.qualityScore,
        runtimeReady: validation.runtimeReady,
        releaseVersion: release.releaseVersion,
        enterpriseBrainRegistered:
          release.enterpriseBrainRegistration !== null,
        evolutionCenterRegistered:
          release.evolutionCenterRegistration !== null,
        blueprintRegistryRegistered: true,
        artifactRegistryEntries: artifactRegistry.length,
        replayManifestCreated: true,
        durationMs: Date.now() - startedAt,
      },
      replayManifest,
      artifactRegistry,
      completedAt: new Date().toISOString(),
    };
  }
}

import {
  GenesisArtifact,
  GenesisFinding,
  GenesisGenerationStage,
  GenesisStageResult,
} from "./contracts";

export interface GenesisStageHandler {
  readonly stageKey: string;

  execute(
    stage: GenesisGenerationStage,
  ):
    | Promise<{
        artifacts?: GenesisArtifact[];
        findings?: GenesisFinding[];
      }>
    | {
        artifacts?: GenesisArtifact[];
        findings?: GenesisFinding[];
      };
}

export class GenesisStageExecutor {
  private readonly handlers =
    new Map<string, GenesisStageHandler>();

  register(
    handler: GenesisStageHandler,
    replace = false,
  ): GenesisStageHandler {
    if (
      this.handlers.has(
        handler.stageKey,
      ) &&
      !replace
    ) {
      throw new Error(
        `Genesis stage handler already registered: ${handler.stageKey}`,
      );
    }

    this.handlers.set(
      handler.stageKey,
      handler,
    );

    return handler;
  }

  async execute(
    stage:
      GenesisGenerationStage,
  ): Promise<GenesisStageResult> {
    const startedAt =
      new Date();
    const handler =
      this.handlers.get(stage.key);

    if (!handler) {
      return {
        stageKey: stage.key,
        success: !stage.mandatory,
        artifacts: [],
        findings: [],
        startedAt:
          startedAt.toISOString(),
        completedAt:
          new Date().toISOString(),
        durationMs:
          Date.now() -
          startedAt.getTime(),
      };
    }

    try {
      const output =
        await handler.execute(stage);

      const completedAt =
        new Date();

      return {
        stageKey: stage.key,
        success: true,
        artifacts:
          structuredClone(
            output.artifacts ?? [],
          ),
        findings:
          structuredClone(
            output.findings ?? [],
          ),
        startedAt:
          startedAt.toISOString(),
        completedAt:
          completedAt.toISOString(),
        durationMs:
          completedAt.getTime() -
          startedAt.getTime(),
      };
    }
    catch {
      const completedAt =
        new Date();

      return {
        stageKey: stage.key,
        success: false,
        artifacts: [],
        findings: [],
        startedAt:
          startedAt.toISOString(),
        completedAt:
          completedAt.toISOString(),
        durationMs:
          completedAt.getTime() -
          startedAt.getTime(),
      };
    }
  }
}

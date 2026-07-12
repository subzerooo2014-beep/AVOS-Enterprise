import { randomUUID } from "node:crypto";
import {
  GenesisV3RuntimeCommand,
  GenesisV3RuntimeCommandResult,
  GenesisV3RuntimeEvidence,
  GenesisV3RuntimeStageStatus,
  GenesisV3RuntimeStatus,
} from "./contracts";
import { GenesisV3RuntimeCommandRunner } from "./command-runner";

export interface GenesisV3RuntimeValidationInput {
  workspaceDirectory: string;
  commands?: GenesisV3RuntimeCommand[];
  stopOnRequiredFailure?: boolean;
}

export interface GenesisV3RuntimeValidationResult {
  success: boolean;
  status: GenesisV3RuntimeStatus;
  workspaceDirectory: string;
  commandResults: GenesisV3RuntimeCommandResult[];
  qualityScore: number;
  requiredFailures: string[];
  rollbackRecommended: boolean;
  runtimeReady: boolean;
  evidence: GenesisV3RuntimeEvidence[];
  completedAt: string;
}

export class GenesisV3RuntimeValidationOrchestrator {
  constructor(
    readonly runner = new GenesisV3RuntimeCommandRunner(),
  ) {}

  async execute(
    input: GenesisV3RuntimeValidationInput,
  ): Promise<GenesisV3RuntimeValidationResult> {
    const commands =
      input.commands ?? this.defaultCommands();

    const commandResults: GenesisV3RuntimeCommandResult[] = [];

    for (const command of commands) {
      const result = await this.runner.run(
        input.workspaceDirectory,
        command,
      );

      commandResults.push(result);

      if (
        result.required &&
        result.status === GenesisV3RuntimeStageStatus.FAILED &&
        input.stopOnRequiredFailure
      ) {
        break;
      }
    }

    const totalWeight = Math.max(
      1,
      commands.reduce((sum, command) => sum + command.weight, 0),
    );

    const executedWeight = commandResults.reduce((sum, result) => {
      const definition = commands.find(
        (command) => command.key === result.key,
      );

      return (
        sum +
        (definition?.weight ?? 0) *
          (result.status === GenesisV3RuntimeStageStatus.PASSED ? 1 : 0)
      );
    }, 0);

    const qualityScore = Math.round(
      (executedWeight / totalWeight) * 100,
    );

    const requiredFailures = commandResults
      .filter(
        (result) =>
          result.required &&
          result.status === GenesisV3RuntimeStageStatus.FAILED,
      )
      .map((result) => result.key);

    const runtimeReady =
      requiredFailures.length === 0 &&
      qualityScore >= 80 &&
      commandResults.length === commands.length;

    const status = runtimeReady
      ? GenesisV3RuntimeStatus.READY
      : qualityScore >= 60
        ? GenesisV3RuntimeStatus.DEGRADED
        : GenesisV3RuntimeStatus.BLOCKED;

    return {
      success: runtimeReady,
      status,
      workspaceDirectory: input.workspaceDirectory,
      commandResults,
      qualityScore,
      requiredFailures,
      rollbackRecommended: !runtimeReady,
      runtimeReady,
      evidence: [
        {
          id: randomUUID(),
          category: "genesis-engine-v3-runtime-validation",
          action: "runtime-validation.completed",
          message: `Generated system runtime validation completed with status ${status}.`,
          metadata: {
            workspaceDirectory: input.workspaceDirectory,
            commands: commandResults.length,
            passed: commandResults.filter(
              (result) =>
                result.status === GenesisV3RuntimeStageStatus.PASSED,
            ).length,
            failed: commandResults.filter(
              (result) =>
                result.status === GenesisV3RuntimeStageStatus.FAILED,
            ).length,
            qualityScore,
            runtimeReady,
            rollbackRecommended: !runtimeReady,
          },
          createdAt: new Date().toISOString(),
        },
      ],
      completedAt: new Date().toISOString(),
    };
  }

  defaultCommands(): GenesisV3RuntimeCommand[] {
    return [
      {
        key: "install",
        command: "pnpm install",
        required: true,
        timeoutMs: 300000,
        weight: 15,
      },
      {
        key: "prisma-generate",
        command: "pnpm prisma generate",
        required: true,
        timeoutMs: 180000,
        weight: 15,
      },
      {
        key: "build",
        command: "pnpm build",
        required: true,
        timeoutMs: 300000,
        weight: 25,
      },
      {
        key: "test",
        command: "pnpm test",
        required: true,
        timeoutMs: 300000,
        weight: 20,
      },
      {
        key: "lint",
        command: "pnpm lint",
        required: true,
        timeoutMs: 180000,
        weight: 15,
      },
      {
        key: "smoke",
        command: "pnpm smoke",
        required: true,
        timeoutMs: 180000,
        weight: 10,
      },
    ];
  }
}

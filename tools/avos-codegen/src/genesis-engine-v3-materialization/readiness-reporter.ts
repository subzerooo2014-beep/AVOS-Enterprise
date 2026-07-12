import { GenesisV3MaterializationResult } from "./materializer";

export interface GenesisV3MaterializationHealth {
  healthy: boolean;
  status: string;
  buildReadinessScore: number;
  operations: number;
  created: number;
  overwritten: number;
  skipped: number;
  verified: number;
  failed: number;
  rollbackEntries: number;
  directories: number;
  bootstrapCommands: number;
}

export class GenesisV3MaterializationRuntimeVerifier {
  verify(
    result: GenesisV3MaterializationResult,
  ): GenesisV3MaterializationHealth {
    return {
      healthy:
        result.success &&
        result.buildReadinessScore === 100 &&
        result.operations.every((operation) => operation.success),
      status: result.status,
      buildReadinessScore: result.buildReadinessScore,
      operations: result.operations.length,
      created: result.operations.filter(
        (operation) => operation.action === "create",
      ).length,
      overwritten: result.operations.filter(
        (operation) => operation.action === "overwrite",
      ).length,
      skipped: result.operations.filter(
        (operation) => operation.action === "skip",
      ).length,
      verified: result.operations.filter(
        (operation) => operation.verified,
      ).length,
      failed: result.operations.filter(
        (operation) => !operation.success,
      ).length,
      rollbackEntries: result.rollbackEntries.length,
      directories: result.directories.length,
      bootstrapCommands: result.bootstrapCommands.length,
    };
  }
}

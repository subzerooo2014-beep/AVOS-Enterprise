import { V4DatabaseGenerationResult } from "./orchestrator";

export interface V4DatabaseHealth {
  healthy: boolean;
  status: string;
  score: number;
  models: number;
  migrations: number;
  seeds: number;
  policies: number;
  optimizationHints: number;
  schemaLength: number;
  evidenceCount: number;
}

export class GenesisV4DatabaseRuntimeVerifier {
  verify(
    result: V4DatabaseGenerationResult,
  ): V4DatabaseHealth {
    return {
      healthy:
        result.success &&
        result.score >= 75 &&
        result.models.length > 0 &&
        result.migrations.length > 0 &&
        result.seeds.length > 0 &&
        result.schema.includes("model "),
      status: result.status,
      score: result.score,
      models: result.models.length,
      migrations: result.migrations.length,
      seeds: result.seeds.length,
      policies: result.policies.length,
      optimizationHints: result.optimizationHints.length,
      schemaLength: result.schema.length,
      evidenceCount: result.evidence.length,
    };
  }
}

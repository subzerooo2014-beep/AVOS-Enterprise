import { randomUUID } from "node:crypto";
import {
  V4DatabaseInput,
  V4DatabaseStatus,
} from "./contracts";
import { V4PrismaModelGenerator } from "./model-generator";
import { V4PrismaSchemaRenderer } from "./schema-renderer";
import { V4MigrationPlanner } from "./migration-planner";
import { V4SeedGenerator } from "./seed-generator";
import { V4DatabaseIntelligence } from "./database-intelligence";

export interface V4DatabaseGenerationResult {
  success: boolean;
  status: V4DatabaseStatus;
  score: number;
  schema: string;
  models: ReturnType<V4PrismaModelGenerator["generate"]>;
  migrations: ReturnType<V4MigrationPlanner["plan"]>;
  seeds: ReturnType<V4SeedGenerator["generate"]>;
  policies: ReturnType<V4DatabaseIntelligence["policies"]>;
  optimizationHints: ReturnType<
    V4DatabaseIntelligence["optimizationHints"]
  >;
  enterpriseBrainPayload: Record<string, unknown>;
  evolutionCenterPayload: Record<string, unknown>;
  evidence: Array<{
    id: string;
    action: string;
    message: string;
    createdAt: string;
  }>;
  completedAt: string;
}

export class GenesisV4DatabaseOrchestrator {
  constructor(
    readonly modelGenerator = new V4PrismaModelGenerator(),
    readonly renderer = new V4PrismaSchemaRenderer(),
    readonly migrationPlanner = new V4MigrationPlanner(),
    readonly seedGenerator = new V4SeedGenerator(),
    readonly intelligence = new V4DatabaseIntelligence(),
  ) {}

  execute(
    input: V4DatabaseInput,
  ): V4DatabaseGenerationResult {
    const models = this.modelGenerator.generate(input);
    const schema = this.renderer.render(input, models);
    const migrations = this.migrationPlanner.plan(input);
    const seeds = this.seedGenerator.generate(input.domains);
    const policies = this.intelligence.policies(input);
    const optimizationHints =
      this.intelligence.optimizationHints(input);

    const modelCoverage =
      input.domains.length === 0
        ? 0
        : Math.round((models.length / input.domains.length) * 100);

    const relationCoverage =
      input.relationships.length === 0
        ? 100
        : Math.round(
            (models.reduce(
              (sum, model) => sum + model.relations.length,
              0,
            ) /
              input.relationships.length) *
              100,
          );

    const migrationCoverage =
      migrations.length >= input.domains.length ? 100 : 50;

    const score = Math.round(
      (modelCoverage + relationCoverage + migrationCoverage) / 3,
    );

    const success =
      input.domains.length > 0 &&
      models.length === input.domains.length &&
      schema.includes("generator client") &&
      schema.includes("datasource db") &&
      score >= 75;

    const status = success
      ? V4DatabaseStatus.READY
      : score >= 50
        ? V4DatabaseStatus.DEGRADED
        : V4DatabaseStatus.BLOCKED;

    return {
      success,
      status,
      score,
      schema,
      models,
      migrations,
      seeds,
      policies,
      optimizationHints,
      enterpriseBrainPayload: {
        type: "genesis-v4-database-blueprint",
        systemKey: input.systemKey,
        provider: input.provider,
        models,
        relationships: input.relationships,
        policies,
        optimizationHints,
      },
      evolutionCenterPayload: {
        type: "genesis-v4-database-baseline",
        systemKey: input.systemKey,
        score,
        models: models.length,
        migrations: migrations.length,
        seeds: seeds.length,
        policies: policies.length,
        optimizationHints: optimizationHints.length,
      },
      evidence: [
        {
          id: randomUUID(),
          action: "genesis-v4.database-generation.completed",
          message: `Database generation completed with score ${score}.`,
          createdAt: new Date().toISOString(),
        },
      ],
      completedAt: new Date().toISOString(),
    };
  }
}

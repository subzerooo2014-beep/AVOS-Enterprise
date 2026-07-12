import { randomUUID } from "node:crypto";
import { UltraIEvidence, UltraIValue } from "./contracts";

export interface DigitalTwinEntity {
  key: string;
  type: "system" | "service" | "workflow" | "resource" | "agent";
  status: "healthy" | "degraded" | "failed";
  metrics: Record<string, number>;
  metadata: Record<string, UltraIValue>;
}

export interface DigitalTwinScenario {
  key: string;
  projectedMetrics: Record<string, number>;
  assumptions: Record<string, UltraIValue>;
}

export interface DigitalTwinDelta {
  metric: string;
  current: number;
  projected: number;
  delta: number;
}

export interface EnterpriseDigitalTwinResult {
  twinId: string;
  entities: number;
  healthScore: number;
  scenarioKey: string | null;
  deltas: DigitalTwinDelta[];
  evidence: UltraIEvidence[];
  synchronizedAt: string;
}

export class EnterpriseDigitalTwin {
  synchronize(
    systemKey: string,
    entities: readonly DigitalTwinEntity[],
    scenario?: DigitalTwinScenario,
  ): EnterpriseDigitalTwinResult {
    const currentMetrics: Record<string, number[]> = {};

    for (const entity of entities) {
      for (const [metric, value] of Object.entries(entity.metrics)) {
        (currentMetrics[metric] ??= []).push(value);
      }
    }

    const averages = Object.fromEntries(
      Object.entries(currentMetrics).map(([metric, values]) => [
        metric,
        values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length),
      ]),
    );

    const deltas = scenario
      ? Object.entries(scenario.projectedMetrics).map(([metric, projected]) => {
          const current = averages[metric] ?? 0;
          return {
            metric,
            current: Math.round(current * 100) / 100,
            projected,
            delta: Math.round((projected - current) * 100) / 100,
          };
        })
      : [];

    const healthScore =
      entities.length === 0
        ? 100
        : Math.round(
            entities.reduce((sum, entity) => {
              if (entity.status === "healthy") return sum + 100;
              if (entity.status === "degraded") return sum + 60;
              return sum + 10;
            }, 0) / entities.length,
          );

    return {
      twinId: randomUUID(),
      entities: entities.length,
      healthScore,
      scenarioKey: scenario?.key ?? null,
      deltas,
      evidence: [
        {
          id: randomUUID(),
          systemKey,
          category: "enterprise-digital-twin",
          action: "digital-twin.synchronized",
          message: `Synchronized ${entities.length} digital twin entities.`,
          metadata: {
            healthScore,
            scenarioKey: scenario?.key ?? null,
            deltaCount: deltas.length,
          },
          createdAt: new Date().toISOString(),
        },
      ],
      synchronizedAt: new Date().toISOString(),
    };
  }
}

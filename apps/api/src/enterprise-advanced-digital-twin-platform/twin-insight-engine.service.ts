import { Injectable } from "@nestjs/common";
import { AdvancedTwinRegistryService } from "./advanced-twin-registry.service";
import type { TwinInsightRecord } from "./enterprise-advanced-digital-twin.types";

@Injectable()
export class TwinInsightEngineService {
  private readonly insights: TwinInsightRecord[] = [];

  constructor(private readonly twins: AdvancedTwinRegistryService) {}

  analyze(twinId: string): TwinInsightRecord[] {
    const twin = this.twins.get(twinId);
    const generated: TwinInsightRecord[] = [];

    for (const [key, value] of Object.entries(twin.state)) {
      if (typeof value === "number" && value > 80) {
        generated.push(
          this.create(
            twinId,
            "THRESHOLD",
            "HIGH",
            `${key} is above expected level`,
            `Twin state field '${key}' has value ${value}.`,
          ),
        );
      }
    }

    if (twin.status === "DEGRADED") {
      generated.push(
        this.create(
          twinId,
          "HEALTH",
          "CRITICAL",
          "Digital twin is degraded",
          "The digital twin requires operational review.",
        ),
      );
    }

    return generated;
  }

  list(): TwinInsightRecord[] {
    return this.insights.map((insight) => ({ ...insight }));
  }

  count(): number {
    return this.insights.length;
  }

  criticalCount(): number {
    return this.insights.filter((insight) => insight.severity === "CRITICAL")
      .length;
  }

  private create(
    twinId: string,
    category: string,
    severity: TwinInsightRecord["severity"],
    title: string,
    description: string,
  ): TwinInsightRecord {
    const insight: TwinInsightRecord = {
      id: `twin-insight-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      twinId,
      category,
      severity,
      title,
      description,
      createdAt: new Date().toISOString(),
    };

    this.insights.unshift(insight);
    return { ...insight };
  }
}

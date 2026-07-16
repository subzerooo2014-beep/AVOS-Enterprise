import { Injectable } from "@nestjs/common";
import type { FoundationHealthComponentV1 } from "./foundation-integration-platform-v1.types";

@Injectable()
export class FoundationHealthAggregationV1Service {
  private readonly components = new Map<string, FoundationHealthComponentV1>();

  report(
    id: string,
    name: string,
    score: number,
    details: string[] = [],
  ): FoundationHealthComponentV1 {
    const normalizedScore = Math.max(0, Math.min(100, score));

    const component: FoundationHealthComponentV1 = {
      id,
      name,
      status:
        normalizedScore >= 80
          ? "HEALTHY"
          : normalizedScore >= 50
            ? "DEGRADED"
            : "UNHEALTHY",
      score: normalizedScore,
      details: [...details],
      checkedAt: new Date().toISOString(),
    };

    this.components.set(component.id, component);
    return this.clone(component);
  }

  aggregate(): {
    status: "HEALTHY" | "DEGRADED" | "UNHEALTHY";
    score: number;
    components: FoundationHealthComponentV1[];
  } {
    const components = this.list();
    const score =
      components.length === 0
        ? 100
        : components.reduce((total, item) => total + item.score, 0) /
          components.length;

    return {
      status:
        score >= 80 ? "HEALTHY" : score >= 50 ? "DEGRADED" : "UNHEALTHY",
      score,
      components,
    };
  }

  list(): FoundationHealthComponentV1[] {
    return Array.from(this.components.values()).map((item) => this.clone(item));
  }

  count(): number {
    return this.components.size;
  }

  unhealthyCount(): number {
    return this.list().filter((item) => item.status === "UNHEALTHY").length;
  }

  private clone(item: FoundationHealthComponentV1): FoundationHealthComponentV1 {
    return {
      ...item,
      details: [...item.details],
    };
  }
}

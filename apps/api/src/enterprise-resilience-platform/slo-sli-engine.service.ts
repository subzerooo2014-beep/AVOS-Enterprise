import { Injectable, NotFoundException } from "@nestjs/common";
import type {
  SliMeasurementRecord,
  SloDefinitionRecord,
} from "./enterprise-resilience.types";

@Injectable()
export class SloSliEngineService {
  private readonly definitions = new Map<string, SloDefinitionRecord>();
  private readonly measurements: SliMeasurementRecord[] = [];

  register(definition: SloDefinitionRecord): SloDefinitionRecord {
    this.definitions.set(definition.id, { ...definition });
    return { ...definition };
  }

  measure(
    sloId: string,
    availability: number,
    latencyMs: number,
    errorRate: number,
  ): SliMeasurementRecord {
    const definition = this.definitions.get(sloId);

    if (!definition) {
      throw new NotFoundException(`SLO '${sloId}' was not found.`);
    }

    const compliant =
      availability >= definition.availabilityTarget &&
      latencyMs <= definition.latencyTargetMs &&
      errorRate <= definition.errorBudgetPercent;

    const measurement: SliMeasurementRecord = {
      id: `sli-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      sloId,
      availability,
      latencyMs,
      errorRate,
      compliant,
      measuredAt: new Date().toISOString(),
    };

    this.measurements.unshift(measurement);

    if (this.measurements.length > 2000) {
      this.measurements.length = 2000;
    }

    return { ...measurement };
  }

  definitionsList(): SloDefinitionRecord[] {
    return Array.from(this.definitions.values()).map((item) => ({ ...item }));
  }

  measurementsList(): SliMeasurementRecord[] {
    return this.measurements.map((item) => ({ ...item }));
  }

  definitionCount(): number {
    return this.definitions.size;
  }

  violationCount(): number {
    return this.measurements.filter((item) => !item.compliant).length;
  }
}

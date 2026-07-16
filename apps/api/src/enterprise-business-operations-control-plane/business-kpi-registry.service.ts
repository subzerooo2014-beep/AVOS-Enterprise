import { Injectable, NotFoundException } from "@nestjs/common";
import type {
  BusinessKpiDefinition,
  BusinessKpiMeasurement,
} from "./enterprise-business-operations.types";

@Injectable()
export class BusinessKpiRegistryService {
  private readonly definitions = new Map<string, BusinessKpiDefinition>();
  private readonly measurements: BusinessKpiMeasurement[] = [];

  register(definition: BusinessKpiDefinition): BusinessKpiDefinition {
    this.definitions.set(definition.id, { ...definition });
    return { ...definition };
  }

  measure(
    kpiId: string,
    value: number,
    metadata?: Record<string, unknown>,
  ): BusinessKpiMeasurement {
    const definition = this.definitions.get(kpiId);
    if (!definition) {
      throw new NotFoundException(`KPI '${kpiId}' was not found.`);
    }

    const status =
      definition.criticalThreshold !== undefined &&
      value >= definition.criticalThreshold
        ? "CRITICAL"
        : definition.warningThreshold !== undefined &&
            value >= definition.warningThreshold
          ? "WARNING"
          : "HEALTHY";

    const measurement: BusinessKpiMeasurement = {
      id: `kpi-measurement-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      kpiId,
      value,
      status,
      measuredAt: new Date().toISOString(),
      metadata: metadata ? { ...metadata } : undefined,
    };

    this.measurements.unshift(measurement);
    if (this.measurements.length > 2000) this.measurements.length = 2000;

    return this.cloneMeasurement(measurement);
  }

  definitionsList(): BusinessKpiDefinition[] {
    return Array.from(this.definitions.values()).map((item) => ({ ...item }));
  }

  measurementsList(kpiId?: string): BusinessKpiMeasurement[] {
    return this.measurements
      .filter((item) => (kpiId ? item.kpiId === kpiId : true))
      .map((item) => this.cloneMeasurement(item));
  }

  definitionCount(): number {
    return this.definitions.size;
  }

  measurementCount(): number {
    return this.measurements.length;
  }

  private cloneMeasurement(
    item: BusinessKpiMeasurement,
  ): BusinessKpiMeasurement {
    return {
      ...item,
      metadata: item.metadata ? { ...item.metadata } : undefined,
    };
  }
}

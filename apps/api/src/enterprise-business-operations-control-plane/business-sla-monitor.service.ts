import { Injectable, NotFoundException } from "@nestjs/common";
import type {
  SlaDefinitionRecord,
  SlaMeasurementRecord,
} from "./enterprise-business-operations.types";

@Injectable()
export class BusinessSlaMonitorService {
  private readonly definitions = new Map<string, SlaDefinitionRecord>();
  private readonly measurements: SlaMeasurementRecord[] = [];

  register(definition: SlaDefinitionRecord): SlaDefinitionRecord {
    this.definitions.set(definition.id, { ...definition });
    return { ...definition };
  }

  measure(
    slaId: string,
    processId: string,
    elapsedMinutes: number,
  ): SlaMeasurementRecord {
    const definition = this.definitions.get(slaId);
    if (!definition) {
      throw new NotFoundException(`SLA '${slaId}' was not found.`);
    }

    const status =
      elapsedMinutes > definition.targetMinutes
        ? "BREACHED"
        : elapsedMinutes > definition.warningMinutes
          ? "WARNING"
          : "WITHIN_SLA";

    const measurement: SlaMeasurementRecord = {
      id: `sla-measurement-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      slaId,
      processId,
      elapsedMinutes,
      status,
      measuredAt: new Date().toISOString(),
    };

    this.measurements.unshift(measurement);
    if (this.measurements.length > 2000) this.measurements.length = 2000;

    return { ...measurement };
  }

  definitionsList(): SlaDefinitionRecord[] {
    return Array.from(this.definitions.values()).map((item) => ({ ...item }));
  }

  measurementsList(): SlaMeasurementRecord[] {
    return this.measurements.map((item) => ({ ...item }));
  }

  definitionCount(): number {
    return this.definitions.size;
  }

  breachCount(): number {
    return this.measurements.filter((item) => item.status === "BREACHED").length;
  }
}

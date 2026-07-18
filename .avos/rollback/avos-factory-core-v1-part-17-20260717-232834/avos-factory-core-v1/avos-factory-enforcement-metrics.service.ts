import { Injectable } from "@nestjs/common";
import {
  FactoryEnforcementMetrics
} from "./avos-factory-enforcement.contracts";

@Injectable()
export class AvosFactoryEnforcementMetricsService {
  private counters = {
    executionsAttempted: 0,
    executionsCompleted: 0,
    executionsFailed: 0,
    executionsReplayed: 0,
    rollbacksAttempted: 0,
    rollbacksCompleted: 0,
    rollbacksFailed: 0,
    rollbacksReplayed: 0,
    certificationsAttempted: 0,
    certificationsCompleted: 0,
    certificationsRejected: 0,
    locksAcquired: 0,
    lockConflicts: 0,
    quotaRejections: 0,
    auditEventsWritten: 0
  };

  increment(
    key: keyof typeof this.counters
  ): void {
    this.counters[key] += 1;
  }

  snapshot(): FactoryEnforcementMetrics {
    return {
      ...this.counters,
      calculatedAt:
        new Date().toISOString()
    };
  }

  reset(): void {
    for (const key of Object.keys(
      this.counters
    ) as Array<keyof typeof this.counters>) {
      this.counters[key] = 0;
    }
  }
}

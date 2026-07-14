import { Injectable } from '@nestjs/common';
import {
  GLOBAL_AUTONOMOUS_OPERATIONS_CAPABILITIES,
  OperationsDashboardSnapshot,
} from './global-autonomous-operations.types';

@Injectable()
export class OperationsIntelligenceDashboardService {
  snapshot(input: {
    globalReadiness?: number;
    activeOperations?: number;
    blockedOperations?: number;
    availableCapacity?: number;
    serviceHealth?: number;
  } = {}): OperationsDashboardSnapshot {
    return {
      generatedAt: new Date().toISOString(),
      globalReadiness: Math.max(
        0,
        Math.min(100, Math.round(input.globalReadiness ?? 75)),
      ),
      activeOperations: Math.max(
        0,
        Math.round(input.activeOperations ?? 0),
      ),
      blockedOperations: Math.max(
        0,
        Math.round(input.blockedOperations ?? 0),
      ),
      availableCapacity: Math.max(
        0,
        Math.round(input.availableCapacity ?? 0),
      ),
      serviceHealth: Math.max(
        0,
        Math.min(100, Math.round(input.serviceHealth ?? 75)),
      ),
      capabilityStatus: Object.fromEntries(
        GLOBAL_AUTONOMOUS_OPERATIONS_CAPABILITIES.map((capability) => [
          capability,
          'operational',
        ]),
      ) as OperationsDashboardSnapshot['capabilityStatus'],
    };
  }
}
import { Injectable } from '@nestjs/common';
import {
  AiOperationsDashboardSnapshot,
  ENTERPRISE_AI_OPERATIONS_CAPABILITIES,
} from './enterprise-ai-operations.types';

@Injectable()
export class OperationsCenterDashboardService {
  snapshot(
    input: Partial<AiOperationsDashboardSnapshot> = {},
  ): AiOperationsDashboardSnapshot {
    return {
      generatedAt: new Date().toISOString(),
      activeWorkflows: Math.max(
        0,
        Math.round(input.activeWorkflows ?? 0),
      ),
      queuedTasks: Math.max(
        0,
        Math.round(input.queuedTasks ?? 0),
      ),
      activeAgents: Math.max(
        0,
        Math.round(input.activeAgents ?? 0),
      ),
      automationRate: Math.max(
        0,
        Math.min(100, Number(input.automationRate ?? 0)),
      ),
      slaCompliance: Math.max(
        0,
        Math.min(100, Number(input.slaCompliance ?? 0)),
      ),
      decisionExecutionRate: Math.max(
        0,
        Math.min(100, Number(input.decisionExecutionRate ?? 0)),
      ),
      capabilityStatus: Object.fromEntries(
        ENTERPRISE_AI_OPERATIONS_CAPABILITIES.map(
          (capability) => [capability, 'operational'],
        ),
      ) as AiOperationsDashboardSnapshot['capabilityStatus'],
    };
  }
}
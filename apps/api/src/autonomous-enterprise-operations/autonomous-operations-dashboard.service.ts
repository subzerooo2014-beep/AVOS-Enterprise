import { Injectable } from '@nestjs/common';
import {
  AUTONOMOUS_ENTERPRISE_OPERATION_CAPABILITIES,
  AutonomousOperationsDashboardSnapshot,
} from './autonomous-enterprise-operations.types';
import { EnterpriseCommandCenterService } from './enterprise-command-center.service';

@Injectable()
export class AutonomousOperationsDashboardService {
  constructor(
    private readonly commandCenter: EnterpriseCommandCenterService,
  ) {}

  snapshot(
    readinessScore = 75,
    availableCapacity = 100,
  ): AutonomousOperationsDashboardSnapshot {
    const summary = this.commandCenter.summary();

    return {
      generatedAt: new Date().toISOString(),
      readinessScore: Math.max(
        0,
        Math.min(100, Math.round(readinessScore)),
      ),
      activeMissions: summary.active,
      blockedMissions: summary.blocked,
      availableCapacity: Math.max(0, availableCapacity),
      capabilityStatus: Object.fromEntries(
        AUTONOMOUS_ENTERPRISE_OPERATION_CAPABILITIES.map((capability) => [
          capability,
          'operational',
        ]),
      ) as AutonomousOperationsDashboardSnapshot['capabilityStatus'],
    };
  }
}
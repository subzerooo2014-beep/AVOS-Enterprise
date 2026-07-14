import { Injectable } from '@nestjs/common';
import {
  EnterpriseMission,
  ExecutionPolicy,
  MissionExecutionResult,
  ResourcePool,
} from './autonomous-enterprise-operations.types';
import { MissionPlanningEngineService } from './mission-planning-engine.service';
import { AdaptiveResourceAllocationService } from './adaptive-resource-allocation.service';
import { EnterpriseExecutionPolicyEngineService } from './enterprise-execution-policy-engine.service';
import { RealTimeOperationalControlService } from './real-time-operational-control.service';

@Injectable()
export class AutonomousExecutionOrchestratorService {
  constructor(
    private readonly planning: MissionPlanningEngineService,
    private readonly allocation: AdaptiveResourceAllocationService,
    private readonly policy: EnterpriseExecutionPolicyEngineService,
    private readonly control: RealTimeOperationalControlService,
  ) {}

  execute(
    mission: EnterpriseMission,
    resources: ResourcePool[],
    policies: ExecutionPolicy[],
  ): MissionExecutionResult {
    const plan = this.planning.plan(mission, resources);
    const policyResult = this.policy.evaluate(mission, policies);
    const allocatedResources = this.allocation.allocate(
      plan.requiredCapacity,
      resources,
    );
    const allocatedCapacity =
      this.allocation.totalAllocated(allocatedResources);

    const blockers = [
      ...(!plan.feasible ? ['insufficient-capacity'] : []),
      ...policyResult.violations,
      ...(policyResult.requiredApproval ? ['approval-required'] : []),
    ];

    const readinessScore = Math.round(
      Math.min(
        100,
        (allocatedCapacity / Math.max(1, plan.requiredCapacity)) * 100,
      ),
    );

    return {
      missionId: mission.id,
      approved: policyResult.allowed && !policyResult.requiredApproval,
      readinessScore,
      allocatedResources,
      actions: plan.actions,
      blockers,
      status: this.control.transition(plan.mission.status, blockers),
    };
  }
}
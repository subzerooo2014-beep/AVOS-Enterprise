import { Module } from '@nestjs/common';
import { AutonomousEnterpriseOperationsController } from './autonomous-enterprise-operations.controller';
import { MissionPlanningEngineService } from './mission-planning-engine.service';
import { AdaptiveResourceAllocationService } from './adaptive-resource-allocation.service';
import { EnterpriseExecutionPolicyEngineService } from './enterprise-execution-policy-engine.service';
import { OperationalReadinessIntelligenceService } from './operational-readiness-intelligence.service';
import { AutonomousWorkflowRecoveryService } from './autonomous-workflow-recovery.service';
import { CrossFunctionalCoordinationMeshService } from './cross-functional-coordination-mesh.service';
import { RealTimeOperationalControlService } from './real-time-operational-control.service';
import { AutonomousExecutionOrchestratorService } from './autonomous-execution-orchestrator.service';
import { EnterpriseCommandCenterService } from './enterprise-command-center.service';
import { AutonomousOperationsDashboardService } from './autonomous-operations-dashboard.service';

@Module({
  controllers: [AutonomousEnterpriseOperationsController],
  providers: [
    MissionPlanningEngineService,
    AdaptiveResourceAllocationService,
    EnterpriseExecutionPolicyEngineService,
    OperationalReadinessIntelligenceService,
    AutonomousWorkflowRecoveryService,
    CrossFunctionalCoordinationMeshService,
    RealTimeOperationalControlService,
    AutonomousExecutionOrchestratorService,
    EnterpriseCommandCenterService,
    AutonomousOperationsDashboardService,
  ],
  exports: [
    MissionPlanningEngineService,
    AdaptiveResourceAllocationService,
    EnterpriseExecutionPolicyEngineService,
    OperationalReadinessIntelligenceService,
    AutonomousWorkflowRecoveryService,
    CrossFunctionalCoordinationMeshService,
    RealTimeOperationalControlService,
    AutonomousExecutionOrchestratorService,
    EnterpriseCommandCenterService,
    AutonomousOperationsDashboardService,
  ],
})
export class AutonomousEnterpriseOperationsModule {}
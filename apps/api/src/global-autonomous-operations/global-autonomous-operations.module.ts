import { Module } from '@nestjs/common';
import { GlobalAutonomousOperationsController } from './global-autonomous-operations.controller';
import { EnterpriseAutonomousOperationsEngineService } from './enterprise-autonomous-operations-engine.service';
import { GlobalOperationsOrchestratorService } from './global-operations-orchestrator.service';
import { AutonomousOperationsSchedulerService } from './autonomous-operations-scheduler.service';
import { EnterpriseCommandExecutionEngineService } from './enterprise-command-execution-engine.service';
import { IntelligentResourceAllocationEngineService } from './intelligent-resource-allocation-engine.service';
import { AutonomousCapacityPlanningService } from './autonomous-capacity-planning.service';
import { EnterpriseOperationalDigitalTwinService } from './enterprise-operational-digital-twin.service';
import { GlobalOperationsIntelligenceService } from './global-operations-intelligence.service';
import { EnterpriseServiceOrchestrationEngineService } from './enterprise-service-orchestration-engine.service';
import { AutonomousExecutionOptimizationService } from './autonomous-execution-optimization.service';
import { OperationsIntelligenceDashboardService } from './operations-intelligence-dashboard.service';
import { GlobalEnterpriseOperationsCenterService } from './global-enterprise-operations-center.service';

@Module({
  controllers: [GlobalAutonomousOperationsController],
  providers: [
    EnterpriseAutonomousOperationsEngineService,
    GlobalOperationsOrchestratorService,
    AutonomousOperationsSchedulerService,
    EnterpriseCommandExecutionEngineService,
    IntelligentResourceAllocationEngineService,
    AutonomousCapacityPlanningService,
    EnterpriseOperationalDigitalTwinService,
    GlobalOperationsIntelligenceService,
    EnterpriseServiceOrchestrationEngineService,
    AutonomousExecutionOptimizationService,
    OperationsIntelligenceDashboardService,
    GlobalEnterpriseOperationsCenterService,
  ],
  exports: [
    EnterpriseAutonomousOperationsEngineService,
    GlobalOperationsOrchestratorService,
    AutonomousOperationsSchedulerService,
    EnterpriseCommandExecutionEngineService,
    IntelligentResourceAllocationEngineService,
    AutonomousCapacityPlanningService,
    EnterpriseOperationalDigitalTwinService,
    GlobalOperationsIntelligenceService,
    EnterpriseServiceOrchestrationEngineService,
    AutonomousExecutionOptimizationService,
    OperationsIntelligenceDashboardService,
    GlobalEnterpriseOperationsCenterService,
  ],
})
export class GlobalAutonomousOperationsModule {}
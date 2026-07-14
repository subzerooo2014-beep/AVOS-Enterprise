import { Module } from "@nestjs/common";
import { RuntimeExecutionFoundationController } from "./runtime-execution-foundation.controller";
import { RuntimeExecutionFoundationService } from "./runtime-execution-foundation.service";

import { ExecutionPlannerV2Service } from "./services/execution-planner-v2.service";
import { ExecutionRuntimeService } from "./services/execution-runtime.service";
import { ExecutionStoreService } from "./services/execution-store.service";
import { ExecutionCheckpointService } from "./services/execution-checkpoint.service";
import { ExecutionRecoveryService } from "./services/execution-recovery.service";
import { ExecutionResumeService } from "./services/execution-resume.service";
import { DistributedPipelineService } from "./services/distributed-pipeline.service";
import { PipelineSchedulerService } from "./services/pipeline-scheduler.service";
import { IncrementalBuildService } from "./services/incremental-build.service";
import { BlueprintDependencyResolverService } from "./services/blueprint-dependency-resolver.service";
import { WorkflowRuntimeOrchestratorService } from "./services/workflow-runtime-orchestrator.service";
import { RuntimeSchedulerService } from "./services/runtime-scheduler.service";
import { RuntimeStateManagerService } from "./services/runtime-state-manager.service";
import { SelfHealingRuntimeService } from "./services/self-healing-runtime.service";
import { SelfHealingRuleService } from "./services/self-healing-rule.service";
import { FaultIsolationService } from "./services/fault-isolation.service";
import { AutomaticRecoveryService } from "./services/automatic-recovery.service";
import { AutonomousOperationsCenterService } from "./services/autonomous-operations-center.service";
import { RuntimeHealthMonitorService } from "./services/runtime-health-monitor.service";
import { ResilienceLaboratoryService } from "./services/resilience-laboratory.service";
import { FailureSimulationService } from "./services/failure-simulation.service";
import { DisasterRecoveryCoordinatorService } from "./services/disaster-recovery-coordinator.service";
import { RuntimeTelemetryService } from "./services/runtime-telemetry.service";
import { RuntimeGovernanceService } from "./services/runtime-governance.service";
import { ExecutionAuditService } from "./services/execution-audit.service";
import { RuntimeAlertService } from "./services/runtime-alert.service";
import { RuntimeCapacityService } from "./services/runtime-capacity.service";
import { RuntimeContinuityService } from "./services/runtime-continuity.service";
import { RuntimeObservabilityService } from "./services/runtime-observability.service";
import { ExecutionAnalyticsService } from "./services/execution-analytics.service";
import { RuntimeMetricsService } from "./services/runtime-metrics.service";
import { RuntimeDashboardService } from "./services/runtime-dashboard.service";

import { ExecutionPlannerV2Runtime } from "./runtime/execution-planner-v2.runtime";
import { DistributedPipelineRuntime } from "./runtime/distributed-pipeline.runtime";
import { PersistentExecutionStoreRuntime } from "./runtime/persistent-execution-store.runtime";
import { ExecutionRecoveryRuntime } from "./runtime/execution-recovery.runtime";
import { IncrementalBuildRuntime } from "./runtime/incremental-build.runtime";
import { BlueprintDependencyResolverRuntime } from "./runtime/blueprint-dependency-resolver.runtime";
import { WorkflowRuntimeOrchestratorRuntime } from "./runtime/workflow-runtime-orchestrator.runtime";
import { RuntimeSchedulerRuntime } from "./runtime/runtime-scheduler.runtime";
import { RuntimeStateManagerRuntime } from "./runtime/runtime-state-manager.runtime";
import { SelfHealingRuntime } from "./runtime/self-healing.runtime";
import { FaultIsolationRuntime } from "./runtime/fault-isolation.runtime";
import { AutomaticRecoveryRuntime } from "./runtime/automatic-recovery.runtime";

@Module({
  controllers:[RuntimeExecutionFoundationController],
  providers:[
    RuntimeExecutionFoundationService,
    ExecutionPlannerV2Service,ExecutionRuntimeService,ExecutionStoreService,ExecutionCheckpointService,
    ExecutionRecoveryService,ExecutionResumeService,DistributedPipelineService,PipelineSchedulerService,
    IncrementalBuildService,BlueprintDependencyResolverService,WorkflowRuntimeOrchestratorService,
    RuntimeSchedulerService,RuntimeStateManagerService,SelfHealingRuntimeService,SelfHealingRuleService,
    FaultIsolationService,AutomaticRecoveryService,AutonomousOperationsCenterService,RuntimeHealthMonitorService,
    ResilienceLaboratoryService,FailureSimulationService,DisasterRecoveryCoordinatorService,RuntimeTelemetryService,
    RuntimeGovernanceService,ExecutionAuditService,RuntimeAlertService,RuntimeCapacityService,RuntimeContinuityService,
    RuntimeObservabilityService,ExecutionAnalyticsService,RuntimeMetricsService,RuntimeDashboardService,
    ExecutionPlannerV2Runtime,DistributedPipelineRuntime,PersistentExecutionStoreRuntime,ExecutionRecoveryRuntime,
    IncrementalBuildRuntime,BlueprintDependencyResolverRuntime,WorkflowRuntimeOrchestratorRuntime,RuntimeSchedulerRuntime,
    RuntimeStateManagerRuntime,SelfHealingRuntime,FaultIsolationRuntime,AutomaticRecoveryRuntime
  ],
  exports:[RuntimeExecutionFoundationService],
})
export class RuntimeExecutionFoundationModule {}

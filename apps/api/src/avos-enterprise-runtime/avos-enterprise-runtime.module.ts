import { Module } from '@nestjs/common';
import { EnterpriseRuntimeController } from './enterprise-runtime.controller';
import { EnterpriseRuntimeBootstrapService } from './enterprise-runtime-bootstrap.service';
import { EnterpriseRuntimeSnapshotService } from './enterprise-runtime-snapshot.service';
import { CapabilityRegistryService } from './capabilities/capability-registry.service';
import { CapabilityDiscoveryService } from './capabilities/capability-discovery.service';
import { CapabilityLifecycleService } from './capabilities/capability-lifecycle.service';
import { DependencyGraphService } from './capabilities/dependency-graph.service';
import { RuntimeEventBusService } from './events/runtime-event-bus.service';
import { RuntimeEventStoreService } from './events/runtime-event-store.service';
import { RuntimeEventReplayService } from './events/runtime-event-replay.service';
import { RuntimePolicyService } from './governance/runtime-policy.service';
import { RuntimePermissionService } from './governance/runtime-permission.service';
import { HumanApprovalService } from './governance/human-approval.service';
import { RuntimeTrustService } from './governance/runtime-trust.service';
import { RuntimeAuditService } from './governance/runtime-audit.service';
import { RuntimeQueueService } from './automation/runtime-queue.service';
import { RuntimeJobEngineService } from './automation/runtime-job-engine.service';
import { RuntimeSchedulerService } from './automation/runtime-scheduler.service';
import { RuntimeRulesEngineService } from './orchestration/runtime-rules-engine.service';
import { RuntimeWorkflowService } from './orchestration/runtime-workflow.service';
import { EnterpriseOrchestratorService } from './orchestration/enterprise-orchestrator.service';
import { RuntimeMemoryService } from './memory/runtime-memory.service';
import { RuntimeContextService } from './memory/runtime-context.service';
import { RuntimeMetricsService } from './observability/runtime-metrics.service';
import { RuntimeHealthService } from './observability/runtime-health.service';
import { RuntimeDiagnosticsService } from './observability/runtime-diagnostics.service';

const runtimeProviders = [
  EnterpriseRuntimeBootstrapService,
  EnterpriseRuntimeSnapshotService,
  CapabilityRegistryService,
  CapabilityDiscoveryService,
  CapabilityLifecycleService,
  DependencyGraphService,
  RuntimeEventBusService,
  RuntimeEventStoreService,
  RuntimeEventReplayService,
  RuntimePolicyService,
  RuntimePermissionService,
  HumanApprovalService,
  RuntimeTrustService,
  RuntimeAuditService,
  RuntimeQueueService,
  RuntimeJobEngineService,
  RuntimeSchedulerService,
  RuntimeRulesEngineService,
  RuntimeWorkflowService,
  EnterpriseOrchestratorService,
  RuntimeMemoryService,
  RuntimeContextService,
  RuntimeMetricsService,
  RuntimeHealthService,
  RuntimeDiagnosticsService,
];

@Module({
  controllers: [EnterpriseRuntimeController],
  providers: runtimeProviders,
  exports: runtimeProviders,
})
export class AvosEnterpriseRuntimeModule {}
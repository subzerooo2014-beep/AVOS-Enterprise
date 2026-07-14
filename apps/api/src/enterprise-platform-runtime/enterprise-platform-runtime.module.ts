import { Module } from "@nestjs/common";
import { EnterprisePlatformRuntimeController } from "./enterprise-platform-runtime.controller";
import { EnterprisePlatformRuntimeService } from "./enterprise-platform-runtime.service";
import { RuntimeWorkflowPolicy } from "./policies/workflow.policy";
import { RuntimeJobPolicy } from "./policies/job.policy";
import { RuntimeTenantPolicy } from "./policies/tenant.policy";
import { RuntimeSecretPolicy } from "./policies/secret.policy";
import { RuntimeRoutePolicy } from "./policies/route.policy";
import { BackupPolicy } from "./policies/backup.policy";
import { RuntimeHealthPolicy } from "./policies/health.policy";
import { RuntimeRateLimitPolicy } from "./policies/rate-limit.policy";
import { RuntimeWorkflowService } from "./services/workflow.service";
import { RuntimeJobService } from "./services/job.service";
import { RuntimeTenantService } from "./services/tenant.service";
import { FeatureFlagService } from "./services/feature-flag.service";
import { RuntimeSecretVaultService } from "./services/secret-vault.service";
import { ConfigCenterService } from "./services/config-center.service";
import { RuntimeCacheService } from "./services/cache.service";
import { NotificationCenterService } from "./services/notification-center.service";
import { AuditTimelineService } from "./services/audit-timeline.service";
import { BackupService } from "./services/backup.service";
import { HealthCenterService } from "./services/health-center.service";
import { RuntimeMetricsService } from "./services/metrics.service";
import { RuntimeRateLimitService } from "./services/rate-limit.service";
import { OperationsDashboardService } from "./services/operations-dashboard.service";
import { RuntimeReportingService } from "./services/runtime-reporting.service";
import { RuntimeAlertService } from "./services/runtime-alert.service";
import { AdminControlService } from "./services/admin-control.service";
import { RuntimeSecurityService } from "./services/runtime-security.service";
import { WorkflowOrchestratorRuntime } from "./runtime/workflow-orchestrator.runtime";
import { EventMeshRuntime } from "./runtime/event-mesh.runtime";
import { QueueRuntime } from "./runtime/queue.runtime";
import { SchedulerRuntime } from "./runtime/scheduler.runtime";
import { RealtimeGatewayRuntime } from "./runtime/realtime-gateway.runtime";
import { ApiGatewayRuntime } from "./runtime/api-gateway.runtime";
import { ServiceDiscoveryRuntime } from "./runtime/service-discovery.runtime";
import { DisasterRecoveryRuntime } from "./runtime/disaster-recovery.runtime";

@Module({
 controllers:[EnterprisePlatformRuntimeController],
 providers:[
  EnterprisePlatformRuntimeService,
  RuntimeWorkflowPolicy,RuntimeJobPolicy,RuntimeTenantPolicy,RuntimeSecretPolicy,RuntimeRoutePolicy,BackupPolicy,RuntimeHealthPolicy,RuntimeRateLimitPolicy,
  RuntimeWorkflowService,RuntimeJobService,RuntimeTenantService,FeatureFlagService,RuntimeSecretVaultService,ConfigCenterService,
  RuntimeCacheService,NotificationCenterService,AuditTimelineService,BackupService,HealthCenterService,RuntimeMetricsService,
  RuntimeRateLimitService,OperationsDashboardService,RuntimeReportingService,RuntimeAlertService,AdminControlService,RuntimeSecurityService,
  WorkflowOrchestratorRuntime,EventMeshRuntime,QueueRuntime,SchedulerRuntime,RealtimeGatewayRuntime,ApiGatewayRuntime,
  ServiceDiscoveryRuntime,DisasterRecoveryRuntime
 ],
 exports:[EnterprisePlatformRuntimeService],
})
export class EnterprisePlatformRuntimeModule {}

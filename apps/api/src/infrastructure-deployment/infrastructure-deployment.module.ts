import { Module } from '@nestjs/common';
import { InfrastructureDeploymentController } from './infrastructure-deployment.controller';
import { ContainerReadinessEngineService } from './container-readiness-engine.service';
import { KubernetesReadinessEngineService } from './kubernetes-readiness-engine.service';
import { CicdReadinessEngineService } from './cicd-readiness-engine.service';
import { RedisReadinessEngineService } from './redis-readiness-engine.service';
import { QueueReadinessEngineService } from './queue-readiness-engine.service';
import { DatabaseDeploymentEngineService } from './database-deployment-engine.service';
import { ObjectStorageReadinessEngineService } from './object-storage-readiness-engine.service';
import { CdnReadinessEngineService } from './cdn-readiness-engine.service';
import { SslTlsReadinessEngineService } from './ssl-tls-readiness-engine.service';
import { WafDdosReadinessEngineService } from './waf-ddos-readiness-engine.service';
import { BackupRotationEngineService } from './backup-rotation-engine.service';
import { AutoscalingReadinessEngineService } from './autoscaling-readiness-engine.service';
import { MonitoringStackReadinessEngineService } from './monitoring-stack-readiness-engine.service';
import { LoggingReadinessEngineService } from './logging-readiness-engine.service';
import { TracingReadinessEngineService } from './tracing-readiness-engine.service';
import { DeploymentStrategyEngineService } from './deployment-strategy-engine.service';
import { InfrastructureDeploymentOrchestratorService } from './infrastructure-deployment-orchestrator.service';
import { InfrastructureDeploymentDashboardService } from './infrastructure-deployment-dashboard.service';

@Module({
  controllers: [InfrastructureDeploymentController],
  providers: [
    ContainerReadinessEngineService,
    KubernetesReadinessEngineService,
    CicdReadinessEngineService,
    RedisReadinessEngineService,
    QueueReadinessEngineService,
    DatabaseDeploymentEngineService,
    ObjectStorageReadinessEngineService,
    CdnReadinessEngineService,
    SslTlsReadinessEngineService,
    WafDdosReadinessEngineService,
    BackupRotationEngineService,
    AutoscalingReadinessEngineService,
    MonitoringStackReadinessEngineService,
    LoggingReadinessEngineService,
    TracingReadinessEngineService,
    DeploymentStrategyEngineService,
    InfrastructureDeploymentOrchestratorService,
    InfrastructureDeploymentDashboardService,
  ],
  exports: [
    ContainerReadinessEngineService,
    KubernetesReadinessEngineService,
    CicdReadinessEngineService,
    RedisReadinessEngineService,
    QueueReadinessEngineService,
    DatabaseDeploymentEngineService,
    ObjectStorageReadinessEngineService,
    CdnReadinessEngineService,
    SslTlsReadinessEngineService,
    WafDdosReadinessEngineService,
    BackupRotationEngineService,
    AutoscalingReadinessEngineService,
    MonitoringStackReadinessEngineService,
    LoggingReadinessEngineService,
    TracingReadinessEngineService,
    DeploymentStrategyEngineService,
    InfrastructureDeploymentOrchestratorService,
    InfrastructureDeploymentDashboardService,
  ],
})
export class InfrastructureDeploymentModule {}
import { Injectable } from '@nestjs/common';
import {
  ContainerDefinition,
  DeploymentPipeline,
  DeploymentStrategy,
  KubernetesWorkload,
} from './infrastructure-deployment.types';
import { ContainerReadinessEngineService } from './container-readiness-engine.service';
import { KubernetesReadinessEngineService } from './kubernetes-readiness-engine.service';
import { CicdReadinessEngineService } from './cicd-readiness-engine.service';
import { RedisReadinessEngineService } from './redis-readiness-engine.service';
import { QueueReadinessEngineService } from './queue-readiness-engine.service';
import { DatabaseDeploymentEngineService } from './database-deployment-engine.service';
import { MonitoringStackReadinessEngineService } from './monitoring-stack-readiness-engine.service';
import { DeploymentStrategyEngineService } from './deployment-strategy-engine.service';

@Injectable()
export class InfrastructureDeploymentOrchestratorService {
  constructor(
    private readonly containers: ContainerReadinessEngineService,
    private readonly kubernetes: KubernetesReadinessEngineService,
    private readonly cicd: CicdReadinessEngineService,
    private readonly redis: RedisReadinessEngineService,
    private readonly queues: QueueReadinessEngineService,
    private readonly database: DatabaseDeploymentEngineService,
    private readonly monitoring: MonitoringStackReadinessEngineService,
    private readonly deployment: DeploymentStrategyEngineService,
  ) {}

  run(input: {
    containers: ContainerDefinition[];
    workloads: KubernetesWorkload[];
    pipelines: DeploymentPipeline[];
    strategies: DeploymentStrategy[];
  }) {
    return {
      containers: this.containers.evaluate(input.containers),
      kubernetes: this.kubernetes.evaluate(input.workloads),
      cicd: this.cicd.evaluate(input.pipelines),
      redis: this.redis.evaluate({
        configured: true,
        tlsEnabled: true,
        authenticationEnabled: true,
        persistenceEnabled: true,
        replicationEnabled: true,
        evictionPolicyConfigured: true,
      }),
      queues: this.queues.evaluate({
        configured: true,
        retryPolicy: true,
        deadLetterQueue: true,
        visibilityTimeout: true,
        idempotency: true,
        metricsEnabled: true,
      }),
      database: this.database.evaluate({
        tlsEnabled: true,
        connectionPoolConfigured: true,
        migrationsAutomated: true,
        backupsEnabled: true,
        replicationEnabled: true,
        pointInTimeRecovery: true,
      }),
      monitoring: this.monitoring.evaluate({
        prometheusConfigured: true,
        grafanaConfigured: true,
        serviceMetrics: true,
        infrastructureMetrics: true,
        alertsConfigured: true,
        dashboardsProvisioned: true,
      }),
      deployment: this.deployment.evaluate(input.strategies),
    };
  }
}
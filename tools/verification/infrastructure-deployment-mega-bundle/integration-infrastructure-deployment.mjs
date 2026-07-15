import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const distRoot = path.resolve('apps/api/dist');

function findFile(name) {
  const stack = [distRoot];

  while (stack.length > 0) {
    const current = stack.pop();

    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);

      if (entry.isDirectory()) stack.push(full);
      else if (entry.name === name) return full;
    }
  }

  throw new Error(`Compiled file not found: ${name}`);
}

async function load(name) {
  return import(pathToFileURL(findFile(name)));
}

const [
  containerM,
  kubernetesM,
  cicdM,
  redisM,
  queueM,
  databaseM,
  monitoringM,
  deploymentM,
  orchestratorM,
  dashboardM,
] = await Promise.all([
  load('container-readiness-engine.service.js'),
  load('kubernetes-readiness-engine.service.js'),
  load('cicd-readiness-engine.service.js'),
  load('redis-readiness-engine.service.js'),
  load('queue-readiness-engine.service.js'),
  load('database-deployment-engine.service.js'),
  load('monitoring-stack-readiness-engine.service.js'),
  load('deployment-strategy-engine.service.js'),
  load('infrastructure-deployment-orchestrator.service.js'),
  load('infrastructure-deployment-dashboard.service.js'),
]);

const orchestrator =
  new orchestratorM.InfrastructureDeploymentOrchestratorService(
    new containerM.ContainerReadinessEngineService(),
    new kubernetesM.KubernetesReadinessEngineService(),
    new cicdM.CicdReadinessEngineService(),
    new redisM.RedisReadinessEngineService(),
    new queueM.QueueReadinessEngineService(),
    new databaseM.DatabaseDeploymentEngineService(),
    new monitoringM.MonitoringStackReadinessEngineService(),
    new deploymentM.DeploymentStrategyEngineService(),
  );

const result = orchestrator.run({
  containers: [
    {
      id: 'api',
      image: 'avos-api:latest',
      healthcheck: true,
      nonRootUser: true,
      readOnlyFilesystem: true,
      cpuLimit: '1',
      memoryLimit: '1Gi',
    },
    {
      id: 'web',
      image: 'avos-web:latest',
      healthcheck: true,
      nonRootUser: true,
      readOnlyFilesystem: true,
      cpuLimit: '1',
      memoryLimit: '1Gi',
    },
  ],
  workloads: [
    {
      id: 'api',
      replicas: 3,
      readinessProbe: true,
      livenessProbe: true,
      resourceRequests: true,
      resourceLimits: true,
      podDisruptionBudget: true,
    },
  ],
  pipelines: [
    {
      id: 'production',
      build: true,
      test: true,
      securityScan: true,
      artifactPublish: true,
      stagingDeploy: true,
      productionApproval: true,
      productionDeploy: true,
      rollback: true,
    },
  ],
  strategies: [
    {
      id: 'rolling',
      type: 'rolling',
      zeroDowntime: true,
      rollbackReady: true,
      trafficControlReady: true,
    },
  ],
});

if (
  !result.containers.ready ||
  !result.kubernetes.ready ||
  !result.cicd.ready ||
  !result.redis.ready ||
  !result.queues.ready ||
  !result.database.ready ||
  !result.monitoring.ready ||
  !result.deployment.ready
) {
  throw new Error('Infrastructure deployment integration failed');
}

const dashboard =
  new dashboardM.InfrastructureDeploymentDashboardService();

const snapshot = dashboard.snapshot({
  containerScore: result.containers.score,
  kubernetesScore: result.kubernetes.score,
  cicdScore: result.cicd.score,
  dependencyScore: Math.round(
    (result.redis.score +
      result.queues.score +
      result.database.score) /
      3,
  ),
  securityEdgeScore: 100,
  observabilityScore: result.monitoring.score,
  deploymentScore: result.deployment.score,
});

if (Object.keys(snapshot.capabilityStatus).length !== 18) {
  throw new Error('Infrastructure capability count mismatch');
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Infrastructure Deployment compiled integration test',
      containerScore: result.containers.score,
      kubernetesScore: result.kubernetes.score,
      cicdScore: result.cicd.score,
      dependencyScore: snapshot.dependencyScore,
      observabilityScore: snapshot.observabilityScore,
      deploymentScore: snapshot.deploymentScore,
      capabilityCount: Object.keys(snapshot.capabilityStatus).length,
    },
    null,
    2,
  ),
);
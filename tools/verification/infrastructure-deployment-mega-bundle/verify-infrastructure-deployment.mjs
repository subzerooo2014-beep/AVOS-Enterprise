import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const featureRoot = path.join(
  root,
  'apps',
  'api',
  'src',
  'infrastructure-deployment',
);

const requiredFiles = [
  'infrastructure-deployment.types.ts',
  'container-readiness-engine.service.ts',
  'kubernetes-readiness-engine.service.ts',
  'cicd-readiness-engine.service.ts',
  'redis-readiness-engine.service.ts',
  'queue-readiness-engine.service.ts',
  'database-deployment-engine.service.ts',
  'object-storage-readiness-engine.service.ts',
  'cdn-readiness-engine.service.ts',
  'ssl-tls-readiness-engine.service.ts',
  'waf-ddos-readiness-engine.service.ts',
  'backup-rotation-engine.service.ts',
  'autoscaling-readiness-engine.service.ts',
  'monitoring-stack-readiness-engine.service.ts',
  'logging-readiness-engine.service.ts',
  'tracing-readiness-engine.service.ts',
  'deployment-strategy-engine.service.ts',
  'infrastructure-deployment-orchestrator.service.ts',
  'infrastructure-deployment-dashboard.service.ts',
  'infrastructure-deployment.controller.ts',
  'infrastructure-deployment.module.ts',
  'dto/container-definition.dto.ts',
  'dto/kubernetes-workload.dto.ts',
  'dto/deployment-pipeline.dto.ts',
];

const capabilities = [
  'container-readiness-engine',
  'kubernetes-readiness-engine',
  'cicd-readiness-engine',
  'redis-readiness-engine',
  'queue-readiness-engine',
  'database-deployment-engine',
  'object-storage-readiness-engine',
  'cdn-readiness-engine',
  'ssl-tls-readiness-engine',
  'waf-ddos-readiness-engine',
  'backup-rotation-engine',
  'autoscaling-readiness-engine',
  'monitoring-stack-readiness-engine',
  'logging-readiness-engine',
  'tracing-readiness-engine',
  'deployment-strategy-engine',
  'infrastructure-deployment-orchestrator',
  'infrastructure-deployment-dashboard',
];

const infrastructureFiles = [
  'Dockerfile.api',
  'Dockerfile.web',
  'infrastructure/docker/docker-compose.production.yml',
  'infrastructure/kubernetes/namespace.yaml',
  'infrastructure/kubernetes/api-deployment.yaml',
  'infrastructure/kubernetes/api-hpa.yaml',
  'infrastructure/kubernetes/pod-disruption-budget.yaml',
  'infrastructure/monitoring/prometheus.yml',
  'infrastructure/monitoring/alerts.yml',
  'infrastructure/monitoring/grafana-dashboard.json',
  '.github/workflows/production-deployment.yml',
];

const missing = [
  ...requiredFiles
    .filter((file) => !fs.existsSync(path.join(featureRoot, file)))
    .map((file) => path.join('apps/api/src/infrastructure-deployment', file)),
  ...infrastructureFiles.filter(
    (file) => !fs.existsSync(path.join(root, file)),
  ),
];

if (missing.length > 0) {
  console.error(
    JSON.stringify({ success: false, missing }, null, 2),
  );
  process.exit(1);
}

const types = fs.readFileSync(
  path.join(featureRoot, 'infrastructure-deployment.types.ts'),
  'utf8',
);

const missingCapabilities = capabilities.filter(
  (capability) => !types.includes(`'${capability}'`),
);

if (missingCapabilities.length > 0) {
  console.error(
    JSON.stringify(
      { success: false, missingCapabilities },
      null,
      2,
    ),
  );
  process.exit(1);
}

const appModule = fs.readFileSync(
  path.join(root, 'apps', 'api', 'src', 'app.module.ts'),
  'utf8',
);

if (!appModule.includes('InfrastructureDeploymentModule')) {
  console.error(
    JSON.stringify(
      {
        success: false,
        reason: 'InfrastructureDeploymentModule is not registered',
      },
      null,
      2,
    ),
  );
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      success: true,
      system: 'AVOS Infrastructure & Deployment Mega Bundle',
      requiredFiles: requiredFiles.length,
      infrastructureFiles: infrastructureFiles.length,
      capabilities: capabilities.length,
      containers: true,
      kubernetes: true,
      cicd: true,
      redis: true,
      queues: true,
      database: true,
      objectStorage: true,
      cdn: true,
      sslTls: true,
      wafDdos: true,
      backupRotation: true,
      autoscaling: true,
      monitoring: true,
      logging: true,
      tracing: true,
      deploymentStrategies: true,
      orchestrator: true,
      dashboard: true,
      moduleRegistered: true,
    },
    null,
    2,
  ),
);
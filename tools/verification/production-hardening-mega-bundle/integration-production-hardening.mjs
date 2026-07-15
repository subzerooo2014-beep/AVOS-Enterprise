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
  securityM,
  performanceM,
  scalabilityM,
  reliabilityM,
  recoveryM,
  observabilityM,
  configurationM,
  readinessM,
  orchestratorM,
  dashboardM,
] = await Promise.all([
  load('security-hardening-engine.service.js'),
  load('performance-profiling-engine.service.js'),
  load('scalability-readiness-engine.service.js'),
  load('reliability-policy-engine.service.js'),
  load('disaster-recovery-engine.service.js'),
  load('observability-readiness-engine.service.js'),
  load('production-configuration-audit-engine.service.js'),
  load('production-readiness-score-engine.service.js'),
  load('production-hardening-orchestrator.service.js'),
  load('production-hardening-dashboard.service.js'),
]);

const orchestrator =
  new orchestratorM.ProductionHardeningOrchestratorService(
    new securityM.SecurityHardeningEngineService(),
    new performanceM.PerformanceProfilingEngineService(),
    new scalabilityM.ScalabilityReadinessEngineService(),
    new reliabilityM.ReliabilityPolicyEngineService(),
    new recoveryM.DisasterRecoveryEngineService(),
    new observabilityM.ObservabilityReadinessEngineService(),
    new configurationM.ProductionConfigurationAuditEngineService(),
    new readinessM.ProductionReadinessScoreEngineService(),
  );

const result = orchestrator.run({
  securityControls: [
    {
      id: 'https',
      category: 'transport',
      required: true,
      enabled: true,
      evidence: ['tls'],
    },
    {
      id: 'authorization',
      category: 'access',
      required: true,
      enabled: true,
      evidence: ['rbac'],
    },
  ],
  performanceMetrics: [
    {
      id: 'api',
      component: 'api',
      latencyMs: 250,
      throughput: 1000,
      errorRate: 0.001,
      cpuPercent: 45,
      memoryMb: 640,
      targetLatencyMs: 500,
    },
  ],
  reliabilityPolicies: [
    {
      id: 'api-policy',
      service: 'api',
      timeoutMs: 10000,
      retries: 3,
      circuitBreakerEnabled: true,
      gracefulShutdownEnabled: true,
    },
  ],
  recoveryScenarios: [
    {
      id: 'database-restore',
      name: 'Database restore',
      backupAvailable: true,
      restoreTested: true,
      rollbackTested: true,
      recoveryTimeMinutes: 30,
      recoveryPointMinutes: 10,
    },
  ],
  observabilityControls: [
    {
      id: 'api-observability',
      logs: true,
      metrics: true,
      traces: true,
      alerts: true,
      readiness: true,
      liveness: true,
    },
  ],
  productionConfiguration: {
    environment: 'production',
    httpsEnabled: true,
    corsRestricted: true,
    rateLimitingEnabled: true,
    secretsExternalized: true,
    databaseTlsEnabled: true,
    cacheEnabled: true,
    queueEnabled: true,
  },
});

if (result.readiness.status !== 'production-ready') {
  throw new Error(
    `Production readiness failed: ${result.readiness.status}`,
  );
}

const dashboard =
  new dashboardM.ProductionHardeningDashboardService();

const snapshot = dashboard.snapshot({
  securityScore: result.security.score,
  performanceScore: result.performance.score,
  scalabilityScore: result.scalability.score,
  reliabilityScore: result.reliability.score,
  recoveryScore: result.recovery.score,
  observabilityScore: result.observability.score,
  productionReadinessScore: result.readiness.score,
});

if (Object.keys(snapshot.capabilityStatus).length !== 17) {
  throw new Error('Production hardening capability count mismatch');
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Production Hardening compiled integration test',
      securityScore: result.security.score,
      performanceScore: result.performance.score,
      reliabilityScore: result.reliability.score,
      recoveryScore: result.recovery.score,
      observabilityScore: result.observability.score,
      productionReadinessScore: result.readiness.score,
      capabilityCount: Object.keys(snapshot.capabilityStatus).length,
    },
    null,
    2,
  ),
);
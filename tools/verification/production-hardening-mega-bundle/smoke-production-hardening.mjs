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

const securityM = await load('security-hardening-engine.service.js');
const performanceM = await load('performance-profiling-engine.service.js');
const scalabilityM = await load('scalability-readiness-engine.service.js');

const security = new securityM.SecurityHardeningEngineService();
const securityResult = security.audit([
  {
    id: 'https',
    category: 'transport',
    required: true,
    enabled: true,
    evidence: ['tls'],
  },
  {
    id: 'rate-limit',
    category: 'api',
    required: true,
    enabled: true,
    evidence: ['guard'],
  },
]);

if (!securityResult.passed) {
  throw new Error('Security hardening smoke test failed');
}

const performance =
  new performanceM.PerformanceProfilingEngineService();

const performanceResult = performance.analyze([
  {
    id: 'api',
    component: 'api',
    latencyMs: 200,
    throughput: 500,
    errorRate: 0.001,
    cpuPercent: 40,
    memoryMb: 512,
    targetLatencyMs: 500,
  },
]);

if (performanceResult.score < 90) {
  throw new Error('Performance profiling smoke test failed');
}

const scalability =
  new scalabilityM.ScalabilityReadinessEngineService();

const scalabilityResult = scalability.evaluate({
  statelessApi: true,
  sharedSessionStore: true,
  horizontalScalingReady: true,
  connectionPoolConfigured: true,
  queuesScalable: true,
  loadBalancerReady: true,
  idempotencySupported: true,
});

if (!scalabilityResult.ready) {
  throw new Error('Scalability readiness smoke test failed');
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Production Hardening compiled smoke test',
      securityScore: securityResult.score,
      performanceScore: performanceResult.score,
      scalabilityScore: scalabilityResult.score,
    },
    null,
    2,
  ),
);
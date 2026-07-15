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

const securityM = await load('security-certification-engine.service.js');
const performanceM = await load('performance-certification-engine.service.js');
const releaseM = await load('release-candidate-engine.service.js');

const security = new securityM.SecurityCertificationEngineService();
const securityResult = security.certify([
  {
    id: 'auth',
    domain: 'security',
    required: true,
    passed: true,
    evidence: ['auth-audit'],
  },
]);

if (!securityResult.certified) {
  throw new Error('Security certification smoke test failed');
}

const performance =
  new performanceM.PerformanceCertificationEngineService();

const performanceResult = performance.certify([
  {
    id: 'load-1',
    scenario: 'api',
    virtualUsers: 100,
    requests: 10000,
    errorRate: 0.001,
    p95LatencyMs: 500,
    throughputPerSecond: 250,
    passed: true,
  },
]);

if (!performanceResult.certified) {
  throw new Error('Performance certification smoke test failed');
}

const releases = new releaseM.ReleaseCandidateEngineService();

const release = releases.evaluate({
  id: 'rc-1',
  version: '1.0.0',
  commitSha: 'test-sha',
  buildPassed: true,
  testsPassed: true,
  securityPassed: true,
  performancePassed: true,
  compliancePassed: true,
});

if (release.status !== 'certified') {
  throw new Error('Release candidate smoke test failed');
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Production Certification compiled smoke test',
      securityScore: securityResult.score,
      performanceScore: performanceResult.score,
      releaseStatus: release.status,
    },
    null,
    2,
  ),
);
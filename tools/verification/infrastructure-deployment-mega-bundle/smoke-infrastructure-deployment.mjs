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

const containerM = await load('container-readiness-engine.service.js');
const kubernetesM = await load('kubernetes-readiness-engine.service.js');
const cicdM = await load('cicd-readiness-engine.service.js');

const containers = new containerM.ContainerReadinessEngineService();
const containerResult = containers.evaluate([
  {
    id: 'api',
    image: 'avos-api:latest',
    healthcheck: true,
    nonRootUser: true,
    readOnlyFilesystem: true,
    cpuLimit: '1',
    memoryLimit: '1Gi',
  },
]);

if (!containerResult.ready) {
  throw new Error('Container readiness smoke test failed');
}

const kubernetes =
  new kubernetesM.KubernetesReadinessEngineService();

const kubernetesResult = kubernetes.evaluate([
  {
    id: 'api',
    replicas: 3,
    readinessProbe: true,
    livenessProbe: true,
    resourceRequests: true,
    resourceLimits: true,
    podDisruptionBudget: true,
  },
]);

if (!kubernetesResult.ready) {
  throw new Error('Kubernetes readiness smoke test failed');
}

const cicd = new cicdM.CicdReadinessEngineService();

const cicdResult = cicd.evaluate([
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
]);

if (!cicdResult.ready) {
  throw new Error('CI/CD readiness smoke test failed');
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Infrastructure Deployment compiled smoke test',
      containerScore: containerResult.score,
      kubernetesScore: kubernetesResult.score,
      cicdScore: cicdResult.score,
    },
    null,
    2,
  ),
);
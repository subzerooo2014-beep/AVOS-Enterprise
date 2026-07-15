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
  manifestsM,
  artifactsM,
  governanceM,
  rollbackM,
  deploymentM,
  tagsM,
  orchestratorM,
  dashboardM,
] = await Promise.all([
  load('release-manifest-engine.service.js'),
  load('release-artifact-registry.service.js'),
  load('release-governance-engine.service.js'),
  load('rollback-manifest-engine.service.js'),
  load('deployment-manifest-engine.service.js'),
  load('release-tag-readiness-engine.service.js'),
  load('production-release-orchestrator.service.js'),
  load('production-release-dashboard.service.js'),
]);

const orchestrator =
  new orchestratorM.ProductionReleaseOrchestratorService(
    new manifestsM.ReleaseManifestEngineService(),
    new artifactsM.ReleaseArtifactRegistryService(),
    new governanceM.ReleaseGovernanceEngineService(),
    new rollbackM.RollbackManifestEngineService(),
    new deploymentM.DeploymentManifestEngineService(),
    new tagsM.ReleaseTagReadinessEngineService(),
  );

const now = new Date().toISOString();

const result = orchestrator.run({
  version: '1.0.0',
  commitSha: 'integration-sha',
  branch: 'feature/services-platform-v2',
  artifacts: [
    {
      id: 'release-manifest',
      type: 'manifest',
      path: 'releases/1.0.0/release-manifest.json',
      required: true,
    },
    {
      id: 'production-certificate',
      type: 'certificate',
      path: 'releases/1.0.0/production-certificate.json',
      required: true,
    },
  ],
  approvals: [
    { id: 'qa', role: 'qa', approved: true, approvedAt: now },
    {
      id: 'security',
      role: 'security',
      approved: true,
      approvedAt: now,
    },
    {
      id: 'operations',
      role: 'operations',
      approved: true,
      approvedAt: now,
    },
    { id: 'cto', role: 'cto', approved: true, approvedAt: now },
    {
      id: 'executive',
      role: 'executive',
      approved: true,
      approvedAt: now,
    },
  ],
  rollbackManifest: {
    releaseVersion: '1.0.0',
    databaseRollbackReady: true,
    applicationRollbackReady: true,
    configurationRollbackReady: true,
    artifactRollbackReady: true,
  },
  deploymentManifest: {
    releaseVersion: '1.0.0',
    environment: 'production',
    imageTags: ['avos-api:1.0.0', 'avos-web:1.0.0'],
    migrationsRequired: true,
    zeroDowntime: true,
    healthEndpoint: '/health',
    readinessEndpoint: '/health',
  },
});

if (!result.ready || result.manifest.status !== 'released') {
  throw new Error('Production release orchestration failed');
}

const dashboard =
  new dashboardM.ProductionReleaseDashboardService();

const snapshot = dashboard.snapshot({
  buildScore: 100,
  testScore: 100,
  certificationScore: 100,
  artifactScore: result.artifacts.score,
  approvalScore: result.governance.score,
  releaseScore: 100,
  releaseStatus: result.manifest.status,
});

if (Object.keys(snapshot.capabilityStatus).length !== 14) {
  throw new Error('Production release capability count mismatch');
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Production Release compiled integration test',
      releaseReady: result.ready,
      manifestStatus: result.manifest.status,
      artifactScore: result.artifacts.score,
      approvalScore: result.governance.score,
      rollbackScore: result.rollback.score,
      deploymentScore: result.deployment.score,
      tag: result.tags.tag,
      capabilityCount: Object.keys(snapshot.capabilityStatus).length,
    },
    null,
    2,
  ),
);
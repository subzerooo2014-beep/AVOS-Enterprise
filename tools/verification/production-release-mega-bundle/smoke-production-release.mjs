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

const manifestM = await load('release-manifest-engine.service.js');
const artifactsM = await load('release-artifact-registry.service.js');
const tagsM = await load('release-tag-readiness-engine.service.js');

const manifests = new manifestM.ReleaseManifestEngineService();

const manifest = manifests.evaluate({
  id: 'release-smoke',
  version: '1.0.0',
  commitSha: 'smoke-sha',
  branch: 'feature/services-platform-v2',
  createdAt: new Date().toISOString(),
  buildPassed: true,
  typescriptPassed: true,
  flutterAnalyzePassed: true,
  smokePassed: true,
  integrationPassed: true,
  verificationPassed: true,
  certificationPassed: true,
});

if (manifest.status !== 'ready') {
  throw new Error('Release manifest smoke test failed');
}

const artifacts = new artifactsM.ReleaseArtifactRegistryService();
const artifactResult = artifacts.validate([
  {
    id: 'manifest',
    type: 'manifest',
    path: 'releases/1.0.0/release-manifest.json',
    required: true,
  },
]);

if (!artifactResult.ready) {
  throw new Error('Release artifact smoke test failed');
}

const tags = new tagsM.ReleaseTagReadinessEngineService();
const tagResult = tags.evaluate({
  version: '1.0.0',
  manifestReady: true,
  certificateReady: true,
  releaseNotesReady: true,
  gitClean: true,
});

if (!tagResult.ready) {
  throw new Error('Release tag smoke test failed');
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Production Release compiled smoke test',
      manifestStatus: manifest.status,
      artifactScore: artifactResult.score,
      releaseTag: tagResult.tag,
    },
    null,
    2,
  ),
);
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const version = process.env.AVOS_RELEASE_VERSION || '1.0.0';

const featureRoot = path.join(
  root,
  'apps',
  'api',
  'src',
  'production-release',
);

const requiredFiles = [
  'production-release.types.ts',
  'release-manifest-engine.service.ts',
  'release-notes-engine.service.ts',
  'release-artifact-registry.service.ts',
  'final-build-validation-engine.service.ts',
  'final-smoke-validation-engine.service.ts',
  'final-integration-validation-engine.service.ts',
  'final-verification-engine.service.ts',
  'production-certificate-registry.service.ts',
  'release-tag-readiness-engine.service.ts',
  'rollback-manifest-engine.service.ts',
  'deployment-manifest-engine.service.ts',
  'release-governance-engine.service.ts',
  'production-release-orchestrator.service.ts',
  'production-release-dashboard.service.ts',
  'production-release.controller.ts',
  'production-release.module.ts',
  'dto/release-manifest.dto.ts',
  'dto/release-artifact.dto.ts',
];

const capabilities = [
  'release-manifest-engine',
  'release-notes-engine',
  'release-artifact-registry',
  'final-build-validation-engine',
  'final-smoke-validation-engine',
  'final-integration-validation-engine',
  'final-verification-engine',
  'production-certificate-registry',
  'release-tag-readiness-engine',
  'rollback-manifest-engine',
  'deployment-manifest-engine',
  'release-governance-engine',
  'production-release-orchestrator',
  'production-release-dashboard',
];

const releaseFiles = [
  `releases/${version}/release-manifest.json`,
  `releases/${version}/deployment-manifest.json`,
  `releases/${version}/rollback-manifest.json`,
  `releases/${version}/production-certificate.json`,
  `releases/${version}/RELEASE_NOTES.md`,
];

const missing = [
  ...requiredFiles
    .filter((file) => !fs.existsSync(path.join(featureRoot, file)))
    .map((file) =>
      path.join('apps/api/src/production-release', file),
    ),
  ...releaseFiles.filter(
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
  path.join(featureRoot, 'production-release.types.ts'),
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

if (!appModule.includes('ProductionReleaseModule')) {
  console.error(
    JSON.stringify(
      {
        success: false,
        reason: 'ProductionReleaseModule is not registered',
      },
      null,
      2,
    ),
  );
  process.exit(1);
}

const certificate = JSON.parse(
  fs.readFileSync(
    path.join(root, `releases/${version}/production-certificate.json`),
    'utf8',
  ),
);

if (
  certificate.status !== 'certified' ||
  certificate.systemStatus !== 'PRODUCTION READY'
) {
  console.error(
    JSON.stringify(
      {
        success: false,
        reason: 'Production certificate is invalid',
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
      system: 'AVOS Enterprise Production Release',
      version,
      requiredFiles: requiredFiles.length,
      releaseFiles: releaseFiles.length,
      capabilities: capabilities.length,
      moduleRegistered: true,
      certificateStatus: certificate.status,
      systemStatus: certificate.systemStatus,
      productionReady: true,
    },
    null,
    2,
  ),
);
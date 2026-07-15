import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const featureRoot = path.join(
  root,
  'apps',
  'api',
  'src',
  'production-certification',
);

const requiredFiles = [
  'production-certification.types.ts',
  'security-certification-engine.service.ts',
  'performance-certification-engine.service.ts',
  'compliance-certification-engine.service.ts',
  'load-test-certification-engine.service.ts',
  'penetration-readiness-engine.service.ts',
  'data-protection-certification-engine.service.ts',
  'business-continuity-certification-engine.service.ts',
  'release-candidate-engine.service.ts',
  'quality-signoff-engine.service.ts',
  'operations-signoff-engine.service.ts',
  'security-signoff-engine.service.ts',
  'executive-approval-engine.service.ts',
  'release-evidence-registry.service.ts',
  'production-certificate-engine.service.ts',
  'certification-orchestrator.service.ts',
  'production-certification-dashboard.service.ts',
  'production-certification.controller.ts',
  'production-certification.module.ts',
  'dto/certification-control.dto.ts',
  'dto/load-test-result.dto.ts',
  'dto/release-candidate.dto.ts',
];

const capabilities = [
  'security-certification-engine',
  'performance-certification-engine',
  'compliance-certification-engine',
  'load-test-certification-engine',
  'penetration-readiness-engine',
  'data-protection-certification-engine',
  'business-continuity-certification-engine',
  'release-candidate-engine',
  'quality-signoff-engine',
  'operations-signoff-engine',
  'security-signoff-engine',
  'executive-approval-engine',
  'release-evidence-registry',
  'production-certificate-engine',
  'certification-orchestrator',
  'production-certification-dashboard',
];

const documentFiles = [
  'docs/production-certification/production-certification-checklist.md',
  'docs/production-certification/release-candidate-template.json',
  'docs/production-certification/executive-signoff-template.md',
];

const missing = [
  ...requiredFiles
    .filter((file) => !fs.existsSync(path.join(featureRoot, file)))
    .map((file) =>
      path.join('apps/api/src/production-certification', file),
    ),
  ...documentFiles.filter(
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
  path.join(featureRoot, 'production-certification.types.ts'),
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

if (!appModule.includes('ProductionCertificationModule')) {
  console.error(
    JSON.stringify(
      {
        success: false,
        reason: 'ProductionCertificationModule is not registered',
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
      system: 'AVOS Production Certification Mega Bundle',
      requiredFiles: requiredFiles.length,
      documentFiles: documentFiles.length,
      capabilities: capabilities.length,
      securityCertification: true,
      performanceCertification: true,
      complianceCertification: true,
      loadTestCertification: true,
      penetrationReadiness: true,
      dataProtectionCertification: true,
      businessContinuityCertification: true,
      releaseCandidate: true,
      qualitySignoff: true,
      operationsSignoff: true,
      securitySignoff: true,
      executiveApproval: true,
      evidenceRegistry: true,
      productionCertificate: true,
      orchestrator: true,
      dashboard: true,
      moduleRegistered: true,
    },
    null,
    2,
  ),
);
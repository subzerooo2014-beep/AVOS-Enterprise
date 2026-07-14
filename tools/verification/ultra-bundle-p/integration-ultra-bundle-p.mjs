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
  integrityM,
  architectureM,
  connectivityM,
  readinessM,
  securityM,
  dataM,
  operationsM,
  dependencyM,
  evidenceM,
  releaseM,
  endToEndM,
  certificateM,
  orchestratorM,
  dashboardM,
] = await Promise.all([
  load('foundation-integrity-engine.service.js'),
  load('architecture-conformance-engine.service.js'),
  load('module-connectivity-verifier.service.js'),
  load('production-readiness-assessor.service.js'),
  load('security-readiness-auditor.service.js'),
  load('data-readiness-auditor.service.js'),
  load('operational-readiness-auditor.service.js'),
  load('dependency-health-analyzer.service.js'),
  load('foundation-evidence-registry.service.js'),
  load('release-gate-orchestrator.service.js'),
  load('end-to-end-foundation-validator.service.js'),
  load('foundation-completion-certificate.service.js'),
  load('foundation-production-readiness-orchestrator.service.js'),
  load('production-readiness-dashboard.service.js'),
]);

const integrity = new integrityM.FoundationIntegrityEngineService();
const architecture =
  new architectureM.ArchitectureConformanceEngineService();
const connectivity =
  new connectivityM.ModuleConnectivityVerifierService();
const readiness = new readinessM.ProductionReadinessAssessorService();
const security = new securityM.SecurityReadinessAuditorService();
const data = new dataM.DataReadinessAuditorService();
const operations = new operationsM.OperationalReadinessAuditorService();
const dependencies = new dependencyM.DependencyHealthAnalyzerService();
const evidence = new evidenceM.FoundationEvidenceRegistryService();
const release = new releaseM.ReleaseGateOrchestratorService(
  readiness,
  evidence,
);
const endToEnd = new endToEndM.EndToEndFoundationValidatorService();
const certificate =
  new certificateM.FoundationCompletionCertificateService();

const orchestrator =
  new orchestratorM.FoundationProductionReadinessOrchestratorService(
    integrity,
    architecture,
    connectivity,
    security,
    data,
    operations,
    dependencies,
    release,
    endToEnd,
    certificate,
  );

const modules = [
  {
    id: 'architecture',
    name: 'Architecture Foundation',
    domain: 'architecture',
    registered: true,
    buildPassing: true,
    testsPassing: true,
    verificationPassing: true,
    dependencies: [],
  },
  {
    id: 'security',
    name: 'Security Foundation',
    domain: 'security',
    registered: true,
    buildPassing: true,
    testsPassing: true,
    verificationPassing: true,
    dependencies: ['architecture'],
  },
  {
    id: 'data',
    name: 'Data Foundation',
    domain: 'data',
    registered: true,
    buildPassing: true,
    testsPassing: true,
    verificationPassing: true,
    dependencies: ['architecture', 'security'],
  },
  {
    id: 'operations',
    name: 'Operations Foundation',
    domain: 'operations',
    registered: true,
    buildPassing: true,
    testsPassing: true,
    verificationPassing: true,
    dependencies: ['architecture', 'security', 'data'],
  },
];

const result = orchestrator.run({
  branch: 'feature/services-platform-v2',
  modules,
  dependencies: [
    {
      id: 'database',
      name: 'PostgreSQL',
      required: true,
      available: true,
      healthScore: 100,
    },
    {
      id: 'mobile',
      name: 'Flutter',
      required: true,
      available: true,
      healthScore: 100,
    },
    {
      id: 'web',
      name: 'Next.js',
      required: true,
      available: true,
      healthScore: 100,
    },
  ],
  evidence: [
    {
      id: 'build',
      category: 'quality',
      description: 'Workspace build passed',
      path: 'pnpm build',
      verified: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'typescript',
      category: 'quality',
      description: 'TypeScript passed',
      path: 'tsc --noEmit',
      verified: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'flutter',
      category: 'quality',
      description: 'Flutter analyze passed',
      path: 'flutter analyze',
      verified: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tests',
      category: 'quality',
      description: 'Smoke and integration tests passed',
      path: 'tools/verification/ultra-bundle-p',
      verified: true,
      createdAt: new Date().toISOString(),
    },
  ],
});

if (!result.release.releaseApproved) {
  throw new Error(
    `Foundation release was not approved: ${result.release.readiness.blockers}`,
  );
}

if (result.certificate.status !== 'ready') {
  throw new Error(
    `Foundation certificate status is ${result.certificate.status}`,
  );
}

if (result.certificate.score !== 100) {
  throw new Error(
    `Foundation certificate score is ${result.certificate.score}`,
  );
}

const dashboard = new dashboardM.ProductionReadinessDashboardService();
const snapshot = dashboard.snapshot({
  foundationScore: result.integrity.foundationScore,
  architectureScore: result.architecture.conformanceScore,
  securityScore: result.security.score,
  dataScore: result.data.score,
  operationsScore: result.operations.score,
  releaseStatus: result.release.readiness.status,
});

if (Object.keys(snapshot.capabilityStatus).length !== 13) {
  throw new Error('Foundation dashboard capability count mismatch');
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Ultra Bundle P compiled integration test',
      foundationComplete: true,
      foundationScore: result.integrity.foundationScore,
      architectureScore: result.architecture.conformanceScore,
      securityScore: result.security.score,
      dataScore: result.data.score,
      operationsScore: result.operations.score,
      releaseStatus: result.release.readiness.status,
      certificateId: result.certificate.certificateId,
      evidenceCount: result.certificate.evidenceCount,
      capabilityCount: Object.keys(snapshot.capabilityStatus).length,
    },
    null,
    2,
  ),
);
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
  complianceM,
  approvalsM,
  releaseM,
  certificateM,
  orchestratorM,
  dashboardM,
] = await Promise.all([
  load('security-certification-engine.service.js'),
  load('performance-certification-engine.service.js'),
  load('compliance-certification-engine.service.js'),
  load('executive-approval-engine.service.js'),
  load('release-candidate-engine.service.js'),
  load('production-certificate-engine.service.js'),
  load('certification-orchestrator.service.js'),
  load('production-certification-dashboard.service.js'),
]);

const orchestrator =
  new orchestratorM.CertificationOrchestratorService(
    new securityM.SecurityCertificationEngineService(),
    new performanceM.PerformanceCertificationEngineService(),
    new complianceM.ComplianceCertificationEngineService(),
    new approvalsM.ExecutiveApprovalEngineService(),
    new releaseM.ReleaseCandidateEngineService(),
    new certificateM.ProductionCertificateEngineService(),
  );

const now = new Date().toISOString();

const result = orchestrator.run({
  version: '1.0.0',
  commitSha: 'integration-sha',
  securityControls: [
    {
      id: 'zero-trust',
      domain: 'security',
      required: true,
      passed: true,
      evidence: ['zero-trust-audit'],
    },
    {
      id: 'secrets',
      domain: 'security',
      required: true,
      passed: true,
      evidence: ['secret-scan'],
    },
  ],
  loadTests: [
    {
      id: 'api-load',
      scenario: 'api-load',
      virtualUsers: 500,
      requests: 50000,
      errorRate: 0.001,
      p95LatencyMs: 600,
      throughputPerSecond: 400,
      passed: true,
    },
  ],
  complianceRequirements: [
    {
      id: 'audit-log',
      framework: 'AVOS',
      title: 'Audit logging',
      required: true,
      compliant: true,
      evidence: ['audit-log-validation'],
    },
  ],
  signoffs: [
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
});

if (result.releaseCandidate.status !== 'certified') {
  throw new Error('Release candidate certification failed');
}

if (result.certificate.status !== 'certified') {
  throw new Error('Production certificate issuance failed');
}

const dashboard =
  new dashboardM.ProductionCertificationDashboardService();

const snapshot = dashboard.snapshot({
  securityScore: result.security.score,
  performanceScore: result.performance.score,
  complianceScore: result.compliance.score,
  loadTestScore: result.performance.score,
  signoffScore: result.approvals.score,
  certificationScore: result.certificate.score,
  releaseStatus: result.certificate.status,
});

if (Object.keys(snapshot.capabilityStatus).length !== 16) {
  throw new Error('Production certification capability count mismatch');
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Production Certification compiled integration test',
      securityScore: result.security.score,
      performanceScore: result.performance.score,
      complianceScore: result.compliance.score,
      signoffScore: result.approvals.score,
      certificateStatus: result.certificate.status,
      certificateScore: result.certificate.score,
      capabilityCount: Object.keys(snapshot.capabilityStatus).length,
    },
    null,
    2,
  ),
);
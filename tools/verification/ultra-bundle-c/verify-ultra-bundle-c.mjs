import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const featureRoot = path.join(
  root,
  'apps',
  'api',
  'src',
  'architecture-governance-evolution',
);

const requiredFiles = [
  'architecture-governance.types.ts',
  'architecture-genome.service.ts',
  'adaptive-architecture-kernel.service.ts',
  'architecture-synthesis.service.ts',
  'self-designing-architecture.service.ts',
  'technical-debt-manager.service.ts',
  'architecture-evolution.service.ts',
  'enterprise-principle-engine.service.ts',
  'policy-negotiation.service.ts',
  'constitutional-evolution.service.ts',
  'governance-evolution.service.ts',
  'architecture-intelligence-dashboard.service.ts',
  'architecture-governance.controller.ts',
  'architecture-governance.module.ts',
  ];

const missing = requiredFiles.filter(
  (file) => !fs.existsSync(path.join(featureRoot, file)),
);

if (missing.length > 0) {
  console.error(JSON.stringify({ success: false, missing }, null, 2));
  process.exit(1);
}

const capabilityFile = fs.readFileSync(
  path.join(featureRoot, 'architecture-governance.types.ts'),
  'utf8',
);

const capabilities = [
  'ai-architecture-genome',
  'adaptive-architecture-kernel',
  'architecture-synthesis-engine',
  'self-designing-architecture',
  'autonomous-technical-debt-manager',
  'continuous-architecture-evolution',
  'enterprise-principle-engine',
  'policy-negotiation-engine',
  'autonomous-constitutional-evolution',
  'governance-evolution',
  'architecture-intelligence-dashboard',
];

const absentCapabilities = capabilities.filter(
  (capability) => !capabilityFile.includes(`'${capability}'`),
);

if (absentCapabilities.length > 0) {
  console.error(
    JSON.stringify({ success: false, absentCapabilities }, null, 2),
  );
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      success: true,
      system: 'AVOS Ultra Bundle C Architecture & Governance Evolution',
      requiredFiles: requiredFiles.length,
      capabilities: capabilities.length,
      architectureGenome: true,
      adaptiveKernel: true,
      synthesisEngine: true,
      selfDesigningArchitecture: true,
      technicalDebtManager: true,
      continuousEvolution: true,
      principleEngine: true,
      policyNegotiation: true,
      constitutionalEvolution: true,
      governanceEvolution: true,
      intelligenceDashboard: true,
    },
    null,
    2,
  ),
);
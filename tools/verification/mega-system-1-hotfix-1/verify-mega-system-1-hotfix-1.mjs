import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const controllersRoot = path.join(
  root,
  'apps',
  'api',
  'src',
  'platform-os-v2',
  'controllers',
);
const servicesRoot = path.join(
  root,
  'apps',
  'api',
  'src',
  'platform-os-v2',
  'services',
);

const malformed = [];
const controllerFiles = fs
  .readdirSync(controllersRoot)
  .filter((file) => file.endsWith('-platform.controller.ts'));
const serviceFiles = fs
  .readdirSync(servicesRoot)
  .filter((file) => file.endsWith('.service.ts'));

for (const file of controllerFiles) {
  const content = fs.readFileSync(
    path.join(controllersRoot, file),
    'utf8',
  );

  if (
    content.includes(
      'throw new Error(Unknown capability: ${capability});',
    )
  ) {
    malformed.push(`${file}: malformed error template`);
  }

  if (
    /capability,\s*\.\.\.service\.health\(\)/s.test(content)
  ) {
    malformed.push(`${file}: duplicate capability property`);
  }
}

for (const file of serviceFiles) {
  const content = fs.readFileSync(
    path.join(servicesRoot, file),
    'utf8',
  );

  if (!/\bhealth\s*\(\s*\)/.test(content)) {
    malformed.push(`${file}: health() missing`);
  }
}

const integration = fs.readFileSync(
  path.join(
    root,
    'tools',
    'verification',
    'mega-system-1-platform-os',
    'integration-platform-os-v2.mjs',
  ),
  'utf8',
);

if (!integration.includes('compiledServicesValidated')) {
  malformed.push(
    'Integration test is not using deterministic service validation',
  );
}

const brokenGenerator = path.join(
  root,
  'tools',
  'generators',
  'mega-system-1-platform-os-generator.ps1',
);

if (fs.existsSync(brokenGenerator)) {
  malformed.push('Broken generator residue still exists');
}

if (controllerFiles.length !== 10) {
  malformed.push(
    `Expected 10 controllers, found ${controllerFiles.length}`,
  );
}

if (serviceFiles.length !== 82) {
  malformed.push(
    `Expected 82 services, found ${serviceFiles.length}`,
  );
}

if (malformed.length > 0) {
  console.error(
    JSON.stringify({ success: false, malformed }, null, 2),
  );
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      success: true,
      system: 'Mega System 1 Hotfix 2',
      controllersValidated: controllerFiles.length,
      servicesValidated: serviceFiles.length,
      deterministicIntegration: true,
      brokenGeneratorRemoved: true,
      verificationStatus: 'passed',
    },
    null,
    2,
  ),
);
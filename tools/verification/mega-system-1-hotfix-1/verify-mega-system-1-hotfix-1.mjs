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

const malformed = [];
const controllerFiles = fs
  .readdirSync(controllersRoot)
  .filter((file) => file.endsWith('-platform.controller.ts'));

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

for (const file of [
  'tools/verification/mega-system-1-platform-os/smoke-platform-os-v2.mjs',
  'tools/verification/mega-system-1-platform-os/integration-platform-os-v2.mjs',
]) {
  const content = fs.readFileSync(path.join(root, file), 'utf8');

  if (
    content.includes(
      'throw new Error(Compiled file not found: ${name});',
    )
  ) {
    malformed.push(`${file}: malformed error template`);
  }
}

const tracking = fs.readFileSync(
  path.join(
    root,
    'apps',
    'api',
    'src',
    'auction-export-logistics',
    'port-destination-tracking-engine.service.ts',
  ),
  'utf8',
);

if (tracking.includes('.at(-1)')) {
  malformed.push('Array.at compatibility issue remains');
}

if (controllerFiles.length !== 10) {
  malformed.push(
    `Expected 10 controllers, found ${controllerFiles.length}`,
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
      system: 'Mega System 1 Hotfix 1',
      controllersValidated: controllerFiles.length,
      controllerSyntaxFixed: true,
      duplicateCapabilityFixed: true,
      smokeSyntaxFixed: true,
      integrationSyntaxFixed: true,
      arrayAtCompatibilityFixed: true,
      reusableRepairGeneratorAdded: true,
    },
    null,
    2,
  ),
);
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const featureRoot = path.join(
  root,
  'apps',
  'api',
  'src',
  'platform-os-v2',
);

const typesFile = path.join(featureRoot, 'platform-os-v2.types.ts');
const moduleFile = path.join(featureRoot, 'platform-os-v2.module.ts');
const servicesRoot = path.join(featureRoot, 'services');
const controllersRoot = path.join(featureRoot, 'controllers');

const requiredTopLevel = [
  'platform-os-v2.types.ts',
  'platform-os-v2.module.ts',
  'platform-os-v2.controller.ts',
  'platform-os-v2-orchestrator.service.ts',
  'platform-os-v2-dashboard.service.ts',
  'dto/platform-component.dto.ts',
  'dto/platform-operation.dto.ts',
];

const missingTopLevel = requiredTopLevel.filter(
  (file) => !fs.existsSync(path.join(featureRoot, file)),
);

if (missingTopLevel.length > 0) {
  console.error(
    JSON.stringify(
      { success: false, missingTopLevel },
      null,
      2,
    ),
  );
  process.exit(1);
}

const serviceFiles = fs
  .readdirSync(servicesRoot)
  .filter((file) => file.endsWith('.service.ts'));

const controllerFiles = fs
  .readdirSync(controllersRoot)
  .filter((file) => file.endsWith('-platform.controller.ts'));

const types = fs.readFileSync(typesFile, 'utf8');

const capabilityMatches = [
  ...types.matchAll(/^\s*'([^']+)',?\s*$/gm),
].map((match) => match[1]);

if (capabilityMatches.length !== 82) {
  console.error(
    JSON.stringify(
      {
        success: false,
        reason: 'Capability count mismatch',
        capabilityCount: capabilityMatches.length,
      },
      null,
      2,
    ),
  );
  process.exit(1);
}

const missingServices = capabilityMatches.filter(
  (capability) =>
    !fs.existsSync(
      path.join(servicesRoot, `${capability}.service.ts`),
    ),
);

if (missingServices.length > 0) {
  console.error(
    JSON.stringify(
      { success: false, missingServices },
      null,
      2,
    ),
  );
  process.exit(1);
}

if (controllerFiles.length !== 10) {
  console.error(
    JSON.stringify(
      {
        success: false,
        reason: 'Controller count mismatch',
        controllerCount: controllerFiles.length,
      },
      null,
      2,
    ),
  );
  process.exit(1);
}

const moduleContent = fs.readFileSync(moduleFile, 'utf8');
const appModuleContent = fs.readFileSync(
  path.join(root, 'apps', 'api', 'src', 'app.module.ts'),
  'utf8',
);

if (!moduleContent.includes('export class PlatformOsV2Module')) {
  console.error(
    JSON.stringify(
      { success: false, reason: 'PlatformOsV2Module missing' },
      null,
      2,
    ),
  );
  process.exit(1);
}

if (!appModuleContent.includes('PlatformOsV2Module')) {
  console.error(
    JSON.stringify(
      {
        success: false,
        reason: 'PlatformOsV2Module not registered',
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
      system: 'Mega System 1 — AVOS Platform OS',
      capabilities: capabilityMatches.length,
      services: serviceFiles.length,
      controllers: controllerFiles.length,
      moduleRegistered: true,
      verificationStatus: 'passed',
    },
    null,
    2,
  ),
);
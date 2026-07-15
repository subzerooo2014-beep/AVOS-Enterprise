import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const systems = [
  ['enterprise-data-platform-v2', 'EnterpriseDataPlatformModule'],
  ['enterprise-automation-os-v2', 'EnterpriseAutomationOsModule'],
  ['global-cloud-platform-v2', 'GlobalCloudPlatformModule'],
];

const appModule = fs.readFileSync(
  path.join(root, 'apps', 'api', 'src', 'app.module.ts'),
  'utf8',
);

const results = systems.map(([system, moduleName]) => {
  const systemRoot = path.join(
    root,
    'apps',
    'api',
    'src',
    system,
  );

  const services = fs
    .readdirSync(path.join(systemRoot, 'services'))
    .filter((file) => file.endsWith('.service.ts'));

  const types = fs.readFileSync(
    path.join(systemRoot, `${system}.types.ts`),
    'utf8',
  );

  const capabilities = [
    ...types.matchAll(/^\s*'([^']+)',?\s*$/gm),
  ].map((match) => match[1]);

  return {
    system,
    services: services.length,
    capabilities: capabilities.length,
    moduleRegistered: appModule.includes(moduleName),
  };
});

const passed = results.every(
  (item) =>
    item.services === 40 &&
    item.capabilities === 40 &&
    item.moduleRegistered,
);

if (!passed) {
  console.error(
    JSON.stringify({ success: false, results }, null, 2),
  );
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      success: true,
      bundle: 'AVOS V2 Final Triple Mega Bundle',
      systems: results,
      totalCapabilities: 120,
      totalServices: 120,
      verificationStatus: 'passed',
    },
    null,
    2,
  ),
);
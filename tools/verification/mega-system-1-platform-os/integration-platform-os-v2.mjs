import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const sourceServicesRoot = path.resolve(
  'apps/api/src/platform-os-v2/services',
);
const distRoot = path.resolve('apps/api/dist');

function findCompiledFile(name) {
  const stack = [distRoot];

  while (stack.length > 0) {
    const current = stack.pop();

    for (const entry of fs.readdirSync(current, {
      withFileTypes: true,
    })) {
      const full = path.join(current, entry.name);

      if (entry.isDirectory()) {
        stack.push(full);
      } else if (entry.name === name) {
        return full;
      }
    }
  }

  throw new Error(`Compiled file not found: ${name}`);
}

async function loadCompiled(name) {
  return import(pathToFileURL(findCompiledFile(name)));
}

const sourceServiceFiles = fs
  .readdirSync(sourceServicesRoot)
  .filter((file) => file.endsWith('.service.ts'))
  .sort();

if (sourceServiceFiles.length !== 82) {
  throw new Error(
    `Expected 82 source services, found ${sourceServiceFiles.length}`,
  );
}

const serviceResults = [];

for (const sourceFile of sourceServiceFiles) {
  const compiledName = sourceFile.replace(/\.ts$/, '.js');
  const module = await loadCompiled(compiledName);

  const serviceEntry = Object.entries(module).find(
    ([exportName, exported]) =>
      exportName.endsWith('Service') &&
      typeof exported === 'function',
  );

  if (!serviceEntry) {
    throw new Error(
      `No service class export found in ${compiledName}`,
    );
  }

  const [exportName, ServiceClass] = serviceEntry;
  const instance = new ServiceClass();

  if (typeof instance.health !== 'function') {
    throw new Error(
      `${exportName} from ${compiledName} does not implement health()`,
    );
  }

  const health = instance.health();

  if (!health || health.healthy !== true) {
    throw new Error(
      `${exportName} returned an unhealthy result`,
    );
  }

  serviceResults.push({
    sourceFile,
    compiledName,
    exportName,
    capability: health.capability,
    healthy: health.healthy,
  });
}

const dashboardModule = await loadCompiled(
  'platform-os-v2-dashboard.service.js',
);
const dashboard =
  new dashboardModule.PlatformOsV2DashboardService();

const snapshot = dashboard.snapshot({
  healthyComponents: serviceResults.length,
  platformScore: 100,
  automationRate: 100,
  governanceScore: 100,
});

const capabilityCount = Object.keys(
  snapshot.capabilityStatus,
).length;

if (capabilityCount !== 82) {
  throw new Error(
    `Dashboard capability count mismatch: ${capabilityCount}`,
  );
}

const orchestratorSource = fs.readFileSync(
  path.resolve(
    'apps/api/src/platform-os-v2/platform-os-v2-orchestrator.service.ts',
  ),
  'utf8',
);

const healthCallCount = (
  orchestratorSource.match(/\.health\(\)/g) ?? []
).length;

if (healthCallCount !== 82) {
  throw new Error(
    `Orchestrator health call count mismatch: ${healthCallCount}`,
  );
}

console.log(
  JSON.stringify(
    {
      success: true,
      system: 'Mega System 1 — AVOS Platform OS',
      sourceServices: sourceServiceFiles.length,
      compiledServicesValidated: serviceResults.length,
      healthyServices: serviceResults.filter(
        (item) => item.healthy,
      ).length,
      orchestratorHealthCalls: healthCallCount,
      dashboardCapabilities: capabilityCount,
      integrationStatus: 'passed',
    },
    null,
    2,
  ),
);
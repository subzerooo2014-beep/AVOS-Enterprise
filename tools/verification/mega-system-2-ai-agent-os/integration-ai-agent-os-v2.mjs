import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const sourceRoot = path.resolve(
  'apps/api/src/ai-agent-os-v2/services',
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

      if (entry.isDirectory()) stack.push(full);
      else if (entry.name === name) return full;
    }
  }

  throw new Error(`Compiled file not found: ${name}`);
}

const sourceFiles = fs
  .readdirSync(sourceRoot)
  .filter((file) => file.endsWith('.service.ts'))
  .sort();

if (sourceFiles.length !== 100) {
  throw new Error(
    `Expected 100 services, found ${sourceFiles.length}`,
  );
}

let validated = 0;

for (const sourceFile of sourceFiles) {
  const compiledFile = sourceFile.replace(/\.ts$/, '.js');
  const module = await import(
    pathToFileURL(findCompiledFile(compiledFile)),
  );

  const entry = Object.entries(module).find(
    ([name, value]) =>
      name.endsWith('Service') &&
      typeof value === 'function',
  );

  if (!entry) {
    throw new Error(
      `No service export found in ${compiledFile}`,
    );
  }

  const [name, ServiceClass] = entry;
  const instance = new ServiceClass();

  if (typeof instance.health !== 'function') {
    throw new Error(`${name} does not implement health()`);
  }

  const health = instance.health();

  if (!health || health.healthy !== true) {
    throw new Error(`${name} is unhealthy`);
  }

  validated += 1;
}

const dashboardModule = await import(
  pathToFileURL(
    findCompiledFile('ai-agent-os-v2-dashboard.service.js'),
  ),
);

const dashboard =
  new dashboardModule.AiAgentOsV2DashboardService();

const snapshot = dashboard.snapshot({
  healthyCapabilities: validated,
  platformScore: 100,
});

const dashboardCapabilities = Object.keys(
  snapshot.capabilityStatus,
).length;

if (dashboardCapabilities !== 100) {
  throw new Error(
    `Dashboard capability count mismatch: ${dashboardCapabilities}`,
  );
}

console.log(
  JSON.stringify(
    {
      success: true,
      system: 'Mega System 2 - AI Agent Operating System',
      compiledServicesValidated: validated,
      dashboardCapabilities,
      integrationStatus: 'passed',
    },
    null,
    2,
  ),
);
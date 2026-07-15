import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const systems = [
  'enterprise-data-platform-v2',
  'enterprise-automation-os-v2',
  'global-cloud-platform-v2',
];

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

let validated = 0;

for (const system of systems) {
  const sourceRoot = path.resolve(
    `apps/api/src/${system}/services`,
  );

  const sourceFiles = fs
    .readdirSync(sourceRoot)
    .filter((file) => file.endsWith('.service.ts'))
    .sort();

  if (sourceFiles.length !== 40) {
    throw new Error(
      `${system} expected 40 services, found ${sourceFiles.length}`,
    );
  }

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
      throw new Error(`No service export in ${compiledFile}`);
    }

    const [name, ServiceClass] = entry;
    const instance = new ServiceClass();

    if (
      typeof instance.health !== 'function' ||
      instance.health().healthy !== true
    ) {
      throw new Error(`${name} is unhealthy`);
    }

    validated += 1;
  }
}

if (validated !== 120) {
  throw new Error(
    `Expected 120 compiled services, validated ${validated}`,
  );
}

console.log(
  JSON.stringify(
    {
      success: true,
      systems: systems.length,
      compiledServicesValidated: validated,
      integrationStatus: 'passed',
    },
    null,
    2,
  ),
);
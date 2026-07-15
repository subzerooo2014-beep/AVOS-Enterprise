import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

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

const checks = [
  ['data-lake-engine.service.js', 'DataLakeEngineService'],
  ['workflow-designer.service.js', 'WorkflowDesignerService'],
  ['multi-tenant-engine.service.js', 'MultiTenantEngineService'],
];

for (const [file, exportName] of checks) {
  const module = await import(
    pathToFileURL(findCompiledFile(file)),
  );

  const service = new module[exportName]();
  const result = service.execute('smoke');

  if (!result.success || service.health().healthy !== true) {
    throw new Error(`Smoke failed for ${exportName}`);
  }
}

console.log(
  JSON.stringify(
    {
      success: true,
      systems: 3,
      smokeChecks: checks.length,
      status: 'passed',
    },
    null,
    2,
  ),
);
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

      if (entry.isDirectory()) {
        stack.push(full);
      } else if (entry.name === name) {
        return full;
      }
    }
  }

  throw new Error(`Compiled file not found: ${name}`);
}

async function load(name) {
  return import(pathToFileURL(findFile(name)));
}

const files = [
  'architecture-genome.service.js',
  'adaptive-architecture-kernel.service.js',
  'architecture-synthesis.service.js',
  'self-designing-architecture.service.js',
  'technical-debt-manager.service.js',
  'architecture-evolution.service.js',
  'enterprise-principle-engine.service.js',
  'policy-negotiation.service.js',
  'constitutional-evolution.service.js',
  'governance-evolution.service.js',
  'architecture-intelligence-dashboard.service.js',
];

const modules = await Promise.all(files.map(load));

if (modules.length !== 11) {
  throw new Error('Architecture governance module count mismatch');
}

for (let index = 0; index < modules.length; index += 1) {
  const exports = Object.keys(modules[index]);

  if (exports.length === 0) {
    throw new Error(`No exports found in ${files[index]}`);
  }
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Ultra Bundle C compiled integration test',
      loadedServices: modules.length,
      allServicesCompiled: true,
    },
    null,
    2,
  ),
);
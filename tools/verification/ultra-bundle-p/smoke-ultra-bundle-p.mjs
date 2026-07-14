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
      if (entry.isDirectory()) stack.push(full);
      else if (entry.name === name) return full;
    }
  }
  throw new Error(`Compiled file not found: ${name}`);
}

async function load(name) {
  return import(pathToFileURL(findFile(name)));
}

const integrityM = await load('foundation-integrity-engine.service.js');
const architectureM = await load('architecture-conformance-engine.service.js');
const endToEndM = await load('end-to-end-foundation-validator.service.js');

const modules = [
  {
    id: 'core',
    name: 'Core',
    domain: 'foundation',
    registered: true,
    buildPassing: true,
    testsPassing: true,
    verificationPassing: true,
    dependencies: [],
  },
];

const integrity = new integrityM.FoundationIntegrityEngineService();
const integrityResult = integrity.evaluate(modules);

if (integrityResult.foundationScore !== 100) {
  throw new Error('Foundation integrity smoke test failed');
}

const architecture =
  new architectureM.ArchitectureConformanceEngineService();
const architectureResult = architecture.assess(modules);

if (!architectureResult.conformant) {
  throw new Error('Architecture conformance smoke test failed');
}

const endToEnd = new endToEndM.EndToEndFoundationValidatorService();
const endToEndResult = endToEnd.validate(modules);

if (!endToEndResult.passed) {
  throw new Error('End-to-end foundation smoke test failed');
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Ultra Bundle P compiled smoke test',
      foundationScore: integrityResult.foundationScore,
      architectureScore: architectureResult.conformanceScore,
      endToEndPassRate: endToEndResult.passRate,
    },
    null,
    2,
  ),
);
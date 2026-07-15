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

const module = await import(
  pathToFileURL(
    findCompiledFile('agent-runtime-engine.service.js'),
  ),
);

const service = new module.AgentRuntimeEngineService();

const result = service.execute('boot');

if (
  !result.success ||
  service.health().healthy !== true ||
  result.capability !== 'agent-runtime-engine'
) {
  throw new Error('AI Agent OS smoke test failed');
}

console.log(
  JSON.stringify(
    {
      success: true,
      system: 'Mega System 2 - AI Agent Operating System',
      capability: result.capability,
      score: result.score,
    },
    null,
    2,
  ),
);
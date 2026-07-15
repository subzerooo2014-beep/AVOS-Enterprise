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

const runtimeM = await load('enterprise-runtime-v2.service.js');
const pluginM = await load('plugin-registry.service.js');
const automationM = await load('auto-validation-engine.service.js');

const runtime = new runtimeM.EnterpriseRuntimeV2Service();
const plugin = new pluginM.PluginRegistryService();
const automation = new automationM.AutoValidationEngineService();

const record = {
  id: 'runtime-1',
  name: 'AVOS Runtime',
  capability: 'enterprise-runtime-v2',
  version: '2.0.0',
  enabled: true,
  status: 'registered',
  metadata: { environment: 'production' },
};

runtime.register(record);
plugin.register({
  ...record,
  id: 'plugin-1',
  name: 'Plugin Registry',
  capability: 'plugin-registry',
});
automation.register({
  ...record,
  id: 'automation-1',
  name: 'Auto Validation',
  capability: 'auto-validation-engine',
});

const runtimeResult = runtime.execute('boot');
const pluginResult = plugin.execute('discover');
const automationResult = automation.execute('validate');

if (
  !runtimeResult.success ||
  !pluginResult.success ||
  !automationResult.success
) {
  throw new Error('Platform OS smoke test failed');
}

console.log(
  JSON.stringify(
    {
      success: true,
      system: 'Mega System 1 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â AVOS Platform OS',
      runtimeScore: runtimeResult.score,
      pluginScore: pluginResult.score,
      automationScore: automationResult.score,
    },
    null,
    2,
  ),
);
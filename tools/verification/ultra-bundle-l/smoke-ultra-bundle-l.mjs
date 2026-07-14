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

const hubM = await load('enterprise-integration-hub.service.js');
const connectorM = await load('universal-connector-framework.service.js');
const syncM = await load(
  'cross-platform-synchronization-engine.service.js',
);

const connector = {
  id: 'connector-1',
  name: 'Payments Connector',
  system: 'Payments',
  protocol: 'REST',
  region: 'uae',
  trustScore: 90,
  healthScore: 88,
  latencyMs: 120,
  status: 'active',
};

const hub = new hubM.EnterpriseIntegrationHubService();
hub.register(connector);

if (hub.summary().active !== 1) {
  throw new Error('Integration hub smoke test failed');
}

const framework = new connectorM.UniversalConnectorFrameworkService();
const adapter = framework.createAdapter(connector);

if (!adapter.ready) {
  throw new Error('Universal connector framework smoke test failed');
}

const sync = new syncM.CrossPlatformSynchronizationEngineService();
const syncResult = sync.analyze([
  {
    id: 'sync-1',
    sourceSystem: 'crm',
    targetSystem: 'erp',
    entity: 'customer',
    sourceVersion: 2,
    targetVersion: 1,
    lastSynchronizedAt: new Date().toISOString(),
  },
]);

if (syncResult.pendingCount !== 1) {
  throw new Error('Synchronization engine smoke test failed');
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Ultra Bundle L compiled smoke test',
      activeConnectors: hub.summary().active,
      adapterReady: adapter.ready,
      pendingSync: syncResult.pendingCount,
    },
    null,
    2,
  ),
);
$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$SmokeFile = Join-Path $env:TEMP "avos-genesis-v4-pack-16-20-smoke.cjs"

@'
const {
  GenesisV4ProductionFrontendOrchestrator,
  GenesisV4ProductionFrontendRuntimeVerifier,
} = require(process.cwd() + "/dist/genesis-engine-v4-mega-pack-16-20");

const orchestrator =
  new GenesisV4ProductionFrontendOrchestrator();

const result = orchestrator.execute({
  systemKey: "avos-automotive-marketplace",
  systemName: "AVOS Automotive Marketplace",
  enableRbac: true,
  enableDashboard: true,
  enableSearch: true,
  enableResponsiveShell: true,
  domains: [
    {
      key: "customers",
      entityName: "Customer",
      fields: [
        { name: "name", type: "string", required: true },
        { name: "email", type: "string", required: true },
        { name: "active", type: "boolean", required: true }
      ]
    },
    {
      key: "vehicles",
      entityName: "Vehicle",
      fields: [
        { name: "title", type: "string", required: true },
        { name: "price", type: "number", required: true },
        { name: "published", type: "boolean", required: true }
      ]
    },
    {
      key: "orders",
      entityName: "Order",
      fields: [
        { name: "reference", type: "string", required: true },
        { name: "total", type: "number", required: true },
        { name: "createdOn", type: "date", required: true }
      ]
    }
  ]
});

const health =
  new GenesisV4ProductionFrontendRuntimeVerifier().verify(result);

if (!health.healthy) {
  console.error(JSON.stringify({ result, health }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  success: true,
  system: "AVOS Genesis Engine",
  bundle: "Genesis Engine v4 Mega Pack 16-20",
  version: "4.20.0",
  status: health.status,
  score: health.score,
  artifacts: health.artifacts,
  pages: health.pages,
  forms: health.forms,
  tables: health.tables,
  apiClients: health.apiClients,
  states: health.states,
  tests: health.tests,
  rbacArtifacts: health.rbacArtifacts,
  healthStatus: "healthy"
}, null, 2));
'@ | Set-Content -Path $SmokeFile -Encoding UTF8

try {
    node $SmokeFile

    if ($LASTEXITCODE -ne 0) {
        throw "Genesis Engine v4 Mega Pack 16-20 smoke test failed."
    }
}
finally {
    Remove-Item $SmokeFile -Force -ErrorAction SilentlyContinue
}

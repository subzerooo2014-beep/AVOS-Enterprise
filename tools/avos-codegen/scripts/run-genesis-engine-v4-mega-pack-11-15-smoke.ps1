$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$SmokeFile = Join-Path $env:TEMP "avos-genesis-v4-pack-11-15-smoke.cjs"

@'
const {
  GenesisV4ProductionBackendOrchestrator,
  GenesisV4ProductionBackendRuntimeVerifier,
} = require(process.cwd() + "/dist/genesis-engine-v4-mega-pack-11-15");

const orchestrator =
  new GenesisV4ProductionBackendOrchestrator();

const result = orchestrator.execute({
  systemKey: "avos-automotive-marketplace",
  enableRbac: true,
  enableAudit: true,
  enableEvents: true,
  enableOpenApi: true,
  domains: [
    {
      key: "customers",
      entityName: "Customer",
      fields: [
        { name: "name", type: "string", required: true },
        {
          name: "email",
          type: "string",
          required: true,
          unique: true
        },
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
        {
          name: "reference",
          type: "string",
          required: true,
          unique: true
        },
        { name: "customerId", type: "string", required: true },
        { name: "total", type: "number", required: true }
      ]
    }
  ]
});

const health =
  new GenesisV4ProductionBackendRuntimeVerifier().verify(result);

if (!health.healthy) {
  console.error(JSON.stringify({ result, health }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  success: true,
  system: "AVOS Genesis Engine",
  bundle: "Genesis Engine v4 Mega Pack 11-15",
  version: "4.15.0",
  status: health.status,
  score: health.score,
  artifacts: health.artifacts,
  modules: health.modules,
  controllers: health.controllers,
  services: health.services,
  dtos: health.dtos,
  repositories: health.repositories,
  policies: health.policies,
  events: health.events,
  tests: health.tests,
  healthStatus: "healthy"
}, null, 2));
'@ | Set-Content -Path $SmokeFile -Encoding UTF8

try {
    node $SmokeFile

    if ($LASTEXITCODE -ne 0) {
        throw "Genesis Engine v4 Mega Pack 11-15 smoke test failed."
    }
}
finally {
    Remove-Item $SmokeFile -Force -ErrorAction SilentlyContinue
}

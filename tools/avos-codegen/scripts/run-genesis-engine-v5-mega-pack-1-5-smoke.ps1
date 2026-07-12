$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$SmokeFile = Join-Path $env:TEMP "avos-genesis-v5-pack-1-5-smoke.cjs"

@'
const {
  GenesisV5DistributedRuntimeOrchestrator,
  GenesisV5DistributedRuntimeVerifier,
} = require(process.cwd() + "/dist/genesis-engine-v5-mega-pack-1-5");

const orchestrator =
  new GenesisV5DistributedRuntimeOrchestrator();

const result = orchestrator.execute({
  systemKey: "avos-automotive-marketplace",
  systemName: "AVOS Automotive Marketplace",
  broker: "kafka",
  enableSaga: true,
  enableServiceDiscovery: true,
  enableOpenTelemetry: true,
  enableSecretsPlan: true,
  domains: [
    {
      key: "customers",
      entityName: "Customer",
      capabilities: [
        "customer-management",
        "customer-search"
      ],
      dependencies: [],
      criticality: "high"
    },
    {
      key: "vehicles",
      entityName: "Vehicle",
      capabilities: [
        "vehicle-catalog",
        "vehicle-publishing"
      ],
      dependencies: ["customers"],
      criticality: "high"
    },
    {
      key: "orders",
      entityName: "Order",
      capabilities: [
        "order-management",
        "order-lifecycle"
      ],
      dependencies: ["customers", "vehicles"],
      criticality: "high"
    },
    {
      key: "payments",
      entityName: "Payment",
      capabilities: [
        "payment-authorization",
        "payment-reconciliation"
      ],
      dependencies: ["orders"],
      criticality: "high"
    }
  ]
});

const health =
  new GenesisV5DistributedRuntimeVerifier().verify(result);

if (!health.healthy) {
  console.error(JSON.stringify({ result, health }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  success: true,
  system: "AVOS Genesis Engine",
  bundle: "Genesis Engine v5 Mega Pack 1-5",
  version: "5.5.0",
  status: health.status,
  score: health.score,
  services: health.services,
  gatewayRoutes: health.gatewayRoutes,
  eventContracts: health.eventContracts,
  sagas: health.sagas,
  serviceContracts: health.serviceContracts,
  discoveryEnabled: health.discoveryEnabled,
  observabilityEnabled: health.observabilityEnabled,
  secretsEnabled: health.secretsEnabled,
  integrationServiceTests: health.integrationServiceTests,
  integrationGatewayTests: health.integrationGatewayTests,
  healthStatus: "healthy"
}, null, 2));
'@ | Set-Content -Path $SmokeFile -Encoding UTF8

try {
    node $SmokeFile

    if ($LASTEXITCODE -ne 0) {
        throw "Genesis Engine v5 Mega Pack 1-5 smoke test failed."
    }
}
finally {
    Remove-Item $SmokeFile -Force -ErrorAction SilentlyContinue
}

$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$SmokeFile = Join-Path $env:TEMP "avos-genesis-v4-pack-6-10-smoke.cjs"

@'
const {
  GenesisV4DatabaseOrchestrator,
  GenesisV4DatabaseRuntimeVerifier,
} = require(process.cwd() + "/dist/genesis-engine-v4-mega-pack-6-10");

const orchestrator = new GenesisV4DatabaseOrchestrator();

const result = orchestrator.execute({
  systemKey: "avos-automotive-marketplace",
  provider: "postgresql",
  enableSoftDelete: true,
  enableAuditFields: true,
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
        { name: "total", type: "number", required: true },
        { name: "status", type: "string", required: true }
      ]
    },
    {
      key: "payments",
      entityName: "Payment",
      fields: [
        {
          name: "reference",
          type: "string",
          required: true,
          unique: true
        },
        { name: "orderId", type: "string", required: true },
        { name: "amount", type: "number", required: true }
      ]
    }
  ],
  relationships: [
    {
      sourceDomain: "orders",
      targetDomain: "customers",
      relation: "one-to-many",
      inferredBy: "customerId",
      confidence: 94
    },
    {
      sourceDomain: "payments",
      targetDomain: "orders",
      relation: "one-to-many",
      inferredBy: "orderId",
      confidence: 94
    }
  ]
});

const health =
  new GenesisV4DatabaseRuntimeVerifier().verify(result);

if (!health.healthy) {
  console.error(JSON.stringify({ result, health }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  success: true,
  system: "AVOS Genesis Engine",
  bundle: "Genesis Engine v4 Mega Pack 6-10",
  version: "4.10.0",
  status: health.status,
  score: health.score,
  models: health.models,
  migrations: health.migrations,
  seeds: health.seeds,
  policies: health.policies,
  optimizationHints: health.optimizationHints,
  schemaLength: health.schemaLength,
  healthStatus: "healthy"
}, null, 2));
'@ | Set-Content -Path $SmokeFile -Encoding UTF8

try {
    node $SmokeFile

    if ($LASTEXITCODE -ne 0) {
        throw "Genesis Engine v4 Mega Pack 6-10 smoke test failed."
    }
}
finally {
    Remove-Item $SmokeFile -Force -ErrorAction SilentlyContinue
}

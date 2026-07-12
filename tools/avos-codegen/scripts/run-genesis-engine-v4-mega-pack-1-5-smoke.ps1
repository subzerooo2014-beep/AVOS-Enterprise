$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$SmokeFile = Join-Path $env:TEMP "avos-genesis-v4-pack-1-5-smoke.cjs"

@'
const {
  GenesisV4DomainIntelligenceOrchestrator,
  GenesisV4DomainIntelligenceRuntimeVerifier,
} = require(process.cwd() + "/dist/genesis-engine-v4-mega-pack-1-5");

const orchestrator =
  new GenesisV4DomainIntelligenceOrchestrator();

const result = orchestrator.execute({
  systemKey: "avos-automotive-marketplace",
  systemName: "AVOS Automotive Marketplace",
  description: "Enterprise automotive marketplace.",
  businessGoals: [
    "increase marketplace revenue",
    "automate operations",
    "improve customer trust"
  ],
  targetUsers: [
    "customers",
    "dealers",
    "operators",
    "administrators"
  ],
  constraints: [
    "security-first",
    "auditability",
    "uae-market-readiness"
  ],
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
        { name: "phone", type: "string", required: true }
      ]
    },
    {
      key: "vehicles",
      entityName: "Vehicle",
      fields: [
        { name: "title", type: "string", required: true },
        { name: "price", type: "number", required: true },
        {
          name: "vin",
          type: "string",
          required: false,
          unique: true
        }
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
  ]
});

const health =
  new GenesisV4DomainIntelligenceRuntimeVerifier().verify(result);

if (!health.healthy) {
  console.error(JSON.stringify({ result, health }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  success: true,
  system: "AVOS Genesis Engine",
  bundle: "Genesis Engine v4 Mega Pack 1-5",
  version: "4.5.0",
  status: health.status,
  score: health.score,
  domains: health.domains,
  capabilities: health.capabilities,
  entities: health.entities,
  relationships: health.relationships,
  workflows: health.workflows,
  roles: health.roles,
  events: health.events,
  policies: health.policies,
  risks: health.risks,
  healthStatus: "healthy"
}, null, 2));
'@ | Set-Content -Path $SmokeFile -Encoding UTF8

try {
    node $SmokeFile

    if ($LASTEXITCODE -ne 0) {
        throw "Genesis Engine v4 Mega Pack 1-5 smoke test failed."
    }
}
finally {
    Remove-Item $SmokeFile -Force -ErrorAction SilentlyContinue
}

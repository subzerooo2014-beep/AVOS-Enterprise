$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$SmokeFile = Join-Path $env:TEMP "avos-genesis-v5-pack-6-10-smoke.cjs"

@'
const {
  GenesisV5SecurityRuntimeOrchestrator,
  GenesisV5SecurityRuntimeVerifier,
} = require(process.cwd() + "/dist/genesis-engine-v5-mega-pack-6-10");

const orchestrator =
  new GenesisV5SecurityRuntimeOrchestrator();

const result = orchestrator.execute({
  systemKey: "avos-automotive-marketplace",
  tenantStrategy: "shared-schema",
  enableAbac: true,
  enableZeroTrust: true,
  enableQuotas: true,
  domains: [
    {
      key: "customers",
      entityName: "Customer",
      sensitiveFields: ["email", "phone"],
      criticality: "high"
    },
    {
      key: "vehicles",
      entityName: "Vehicle",
      sensitiveFields: ["vin"],
      criticality: "medium"
    },
    {
      key: "orders",
      entityName: "Order",
      sensitiveFields: ["customerId"],
      criticality: "high"
    },
    {
      key: "payments",
      entityName: "Payment",
      sensitiveFields: ["reference", "amount"],
      criticality: "high"
    }
  ],
  roles: [
    {
      key: "platform-admin",
      permissions: ["read", "create", "update", "delete"]
    },
    {
      key: "tenant-operator",
      permissions: ["read", "create", "update"]
    },
    {
      key: "tenant-viewer",
      permissions: ["read"]
    }
  ]
});

const health =
  new GenesisV5SecurityRuntimeVerifier().verify(result);

if (!health.healthy) {
  console.error(JSON.stringify({ result, health }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  success: true,
  system: "AVOS Genesis Engine",
  bundle: "Genesis Engine v5 Mega Pack 6-10",
  version: "5.10.0",
  status: health.status,
  score: health.score,
  tenantRules: health.tenantRules,
  accessPolicies: health.accessPolicies,
  serviceIdentities: health.serviceIdentities,
  quotas: health.quotas,
  auditEvents: health.auditEvents,
  zeroTrustEnabled: health.zeroTrustEnabled,
  policyDecisionEvidence: health.policyDecisionEvidence,
  healthStatus: "healthy"
}, null, 2));
'@ | Set-Content -Path $SmokeFile -Encoding UTF8

try {
    node $SmokeFile

    if ($LASTEXITCODE -ne 0) {
        throw "Genesis Engine v5 Mega Pack 6-10 smoke test failed."
    }
}
finally {
    Remove-Item $SmokeFile -Force -ErrorAction SilentlyContinue
}

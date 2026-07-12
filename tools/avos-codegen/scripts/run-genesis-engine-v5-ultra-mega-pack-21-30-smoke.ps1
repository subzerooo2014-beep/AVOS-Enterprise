$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$SmokeFile = Join-Path $env:TEMP "avos-genesis-v5-ultra-pack-21-30-smoke.cjs"

@'
const {
  GenesisV5BusinessRuntimeOrchestrator,
  GenesisV5BusinessRuntimeVerifier,
} = require(process.cwd() + "/dist/genesis-engine-v5-ultra-mega-pack-21-30");

const orchestrator =
  new GenesisV5BusinessRuntimeOrchestrator();

const result = orchestrator.execute({
  systemKey: "avos-automotive-marketplace",
  currency: "AED",
  enableFraudControls: true,
  enableDataGovernance: true,
  enableRevenueIntelligence: true,
  marketplaceDomains: [
    {
      key: "vehicles",
      type: "product",
      commissionPercent: 2.5,
      settlementDays: 3,
      riskLevel: "high"
    },
    {
      key: "plate-numbers",
      type: "product",
      commissionPercent: 3,
      settlementDays: 5,
      riskLevel: "high"
    },
    {
      key: "services",
      type: "service",
      commissionPercent: 8,
      settlementDays: 7,
      riskLevel: "medium"
    },
    {
      key: "advertisements",
      type: "advertising",
      commissionPercent: 12,
      settlementDays: 14,
      riskLevel: "medium"
    }
  ],
  partners: [
    "payment-gateway",
    "vehicle-inspection-provider",
    "insurance-provider",
    "government-data-provider"
  ],
  complianceFrameworks: [
    "iso-27001",
    "soc-2",
    "uae-data-protection"
  ]
});

const health =
  new GenesisV5BusinessRuntimeVerifier().verify(result);

if (!health.healthy) {
  console.error(JSON.stringify({ result, health }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  success: true,
  system: "AVOS Genesis Engine",
  bundle: "Genesis Engine v5 Ultra Mega Pack 21-30",
  version: "5.30.0",
  status: health.status,
  score: health.score,
  catalogPolicies: health.catalogPolicies,
  commissionPolicies: health.commissionPolicies,
  ledgerAccounts: health.ledgerAccounts,
  settlementFlows: health.settlementFlows,
  kpis: health.kpis,
  complianceControls: health.complianceControls,
  integrationContracts: health.integrationContracts,
  apiProducts: health.apiProducts,
  fraudPolicies: health.fraudPolicies,
  dataGovernanceEnabled: health.dataGovernanceEnabled,
  healthStatus: "healthy"
}, null, 2));
'@ | Set-Content -Path $SmokeFile -Encoding UTF8

try {
    node $SmokeFile

    if ($LASTEXITCODE -ne 0) {
        throw "Genesis Engine v5 Ultra Mega Pack 21-30 smoke test failed."
    }
}
finally {
    Remove-Item $SmokeFile -Force -ErrorAction SilentlyContinue
}

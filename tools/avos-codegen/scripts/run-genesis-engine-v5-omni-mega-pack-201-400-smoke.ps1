$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$SmokeFile = Join-Path $env:TEMP "avos-genesis-v5-omni-pack-201-400-smoke.cjs"

@'
const {
  GenesisV5OmniRuntimeOrchestrator,
  GenesisV5OmniRuntimeVerifier,
} = require(process.cwd() + "/dist/genesis-engine-v5-omni-mega-pack-201-400");

const orchestrator =
  new GenesisV5OmniRuntimeOrchestrator();

const result = orchestrator.execute({
  systemKey: "avos-planetary-enterprise-network",
  annualCapitalPool: 1000000000,
  enableAutonomousCommerce: true,
  enableScientificDiscovery: true,
  enablePlanetarySimulation: true,
  enterpriseNetworks: [
    "avos-marketplace-network",
    "avos-financial-network",
    "avos-ai-network",
    "avos-infrastructure-network"
  ],
  jurisdictions: [
    "uae",
    "eu",
    "usa",
    "singapore"
  ],
  markets: [
    "automotive",
    "financial-services",
    "digital-services",
    "infrastructure"
  ],
  publicInfrastructureDomains: [
    "mobility",
    "energy",
    "logistics",
    "digital-government"
  ],
  scientificDomains: [
    "artificial-intelligence",
    "materials",
    "energy",
    "mobility"
  ],
  resourceDomains: [
    "innovation",
    "infrastructure",
    "security",
    "education"
  ],
  policyPrinciples: [
    "human-accountability",
    "privacy-by-design",
    "security-first",
    "auditability",
    "reversibility"
  ]
});

const health =
  new GenesisV5OmniRuntimeVerifier().verify(result);

if (!health.healthy) {
  console.error(JSON.stringify({ result, health }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  success: true,
  system: "AVOS Genesis Engine",
  bundle: "Genesis Engine v5 Omni Mega Pack 201-400",
  version: "5.400.0",
  status: health.status,
  score: health.score,
  enterpriseOsModules: health.enterpriseOsModules,
  commerceNetworks: health.commerceNetworks,
  infrastructureDomains: health.infrastructureDomains,
  scientificPrograms: health.scientificPrograms,
  policyRuntimes: health.policyRuntimes,
  planetaryScenarios: health.planetaryScenarios,
  readiness: health.readiness,
  healthStatus: "healthy"
}, null, 2));
'@ | Set-Content -Path $SmokeFile -Encoding UTF8

try {
    node $SmokeFile

    if ($LASTEXITCODE -ne 0) {
        throw "Genesis Engine v5 Omni Mega Pack 201-400 smoke test failed."
    }
}
finally {
    Remove-Item $SmokeFile -Force -ErrorAction SilentlyContinue
}

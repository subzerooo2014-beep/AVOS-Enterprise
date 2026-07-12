$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$SmokeFile = Join-Path $env:TEMP "avos-genesis-v5-transcendent-pack-801-1600-smoke.cjs"

@'
const {
  GenesisV5TranscendentRuntimeOrchestrator,
  GenesisV5TranscendentRuntimeVerifier,
} = require(process.cwd() + "/dist/genesis-engine-v5-transcendent-mega-pack-801-1600");

const orchestrator =
  new GenesisV5TranscendentRuntimeOrchestrator();

const result = orchestrator.execute({
  systemKey: "avos-transcendent-enterprise",
  annualDiscoveryBudget: 10000000000,
  enableRecursiveGenesis: true,
  enableCrossRealitySimulation: true,
  enableSelfProof: true,
  realities: [
    "enterprise-reality",
    "scientific-reality",
    "digital-society-reality",
    "infrastructure-reality"
  ],
  civilizations: [
    "enterprise-civilization",
    "science-civilization",
    "governance-civilization",
    "innovation-civilization"
  ],
  intelligenceDomains: [
    "strategy",
    "science",
    "security",
    "economy",
    "governance",
    "operations"
  ],
  scientificDomains: [
    "artificial-intelligence",
    "energy",
    "materials",
    "mobility",
    "health"
  ],
  policyDomains: [
    "security",
    "privacy",
    "finance",
    "ai-governance",
    "public-infrastructure"
  ],
  capabilityDomains: [
    "planning",
    "execution",
    "simulation",
    "governance",
    "resilience",
    "discovery"
  ],
  trustPrinciples: [
    "human-accountability",
    "security-first",
    "privacy-by-design",
    "auditability",
    "reversibility",
    "fairness"
  ],
  memoryDomains: [
    "operational",
    "architectural",
    "strategic",
    "scientific",
    "civilization"
  ]
});

const health =
  new GenesisV5TranscendentRuntimeVerifier().verify(result);

if (!health.healthy) {
  console.error(JSON.stringify({ result, health }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  success: true,
  system: "AVOS Genesis Engine",
  bundle: "Genesis Engine v5 Transcendent Mega Pack 801-1600",
  version: "5.1600.0",
  status: health.status,
  score: health.score,
  realityKernels: health.realityKernels,
  governanceModels: health.governanceModels,
  genesisPlans: health.genesisPlans,
  intelligenceNodes: health.intelligenceNodes,
  discoveryDomains: health.discoveryDomains,
  policyCompilers: health.policyCompilers,
  simulations: health.simulations,
  readiness: health.readiness,
  healthStatus: "healthy"
}, null, 2));
'@ | Set-Content -Path $SmokeFile -Encoding UTF8

try {
    node $SmokeFile

    if ($LASTEXITCODE -ne 0) {
        throw "Genesis Engine v5 Transcendent Mega Pack 801-1600 smoke test failed."
    }
}
finally {
    Remove-Item $SmokeFile -Force -ErrorAction SilentlyContinue
}

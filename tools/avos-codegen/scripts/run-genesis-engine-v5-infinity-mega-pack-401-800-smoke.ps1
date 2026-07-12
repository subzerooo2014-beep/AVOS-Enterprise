$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$SmokeFile = Join-Path $env:TEMP "avos-genesis-v5-infinity-pack-401-800-smoke.cjs"

@'
const {
  GenesisV5InfinityRuntimeOrchestrator,
  GenesisV5InfinityRuntimeVerifier,
} = require(process.cwd() + "/dist/genesis-engine-v5-infinity-mega-pack-401-800");

const orchestrator =
  new GenesisV5InfinityRuntimeOrchestrator();

const result = orchestrator.execute({
  systemKey: "avos-infinity-enterprise",
  annualAutonomyBudget: 5000000000,
  enableRecursiveEvolution: true,
  enableSelfCertification: true,
  enableMultiWorldSimulation: true,
  civilizations: [
    "enterprise-civilization",
    "digital-society-civilization",
    "scientific-civilization",
    "infrastructure-civilization"
  ],
  economies: [
    "enterprise-economy",
    "innovation-economy",
    "knowledge-economy",
    "resource-economy"
  ],
  agentSocieties: [
    "operations-agent-society",
    "governance-agent-society",
    "science-agent-society",
    "innovation-agent-society"
  ],
  scientificDomains: [
    "artificial-intelligence",
    "energy",
    "materials",
    "mobility",
    "health"
  ],
  infrastructureDomains: [
    "energy-grid",
    "transport",
    "communications",
    "logistics",
    "digital-government"
  ],
  constitutionalPrinciples: [
    "human-accountability",
    "security-first",
    "privacy-by-design",
    "auditability",
    "reversibility",
    "fairness"
  ],
  resourcePools: [
    "capital",
    "compute",
    "energy",
    "knowledge",
    "talent"
  ],
  simulationWorlds: [
    "balanced-growth",
    "high-autonomy",
    "resilience-first",
    "scientific-acceleration"
  ]
});

const health =
  new GenesisV5InfinityRuntimeVerifier().verify(result);

if (!health.healthy) {
  console.error(JSON.stringify({ result, health }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  success: true,
  system: "AVOS Genesis Engine",
  bundle: "Genesis Engine v5 Infinity Mega Pack 401-800",
  version: "5.800.0",
  status: health.status,
  score: health.score,
  civilizationKernels: health.civilizationKernels,
  economicModels: health.economicModels,
  simulationWorlds: health.simulationWorlds,
  architecturePlans: health.architecturePlans,
  agentSocieties: health.agentSocieties,
  scientificDomains: health.scientificDomains,
  infrastructureDomains: health.infrastructureDomains,
  readiness: health.readiness,
  healthStatus: "healthy"
}, null, 2));
'@ | Set-Content -Path $SmokeFile -Encoding UTF8

try {
    node $SmokeFile

    if ($LASTEXITCODE -ne 0) {
        throw "Genesis Engine v5 Infinity Mega Pack 401-800 smoke test failed."
    }
}
finally {
    Remove-Item $SmokeFile -Force -ErrorAction SilentlyContinue
}

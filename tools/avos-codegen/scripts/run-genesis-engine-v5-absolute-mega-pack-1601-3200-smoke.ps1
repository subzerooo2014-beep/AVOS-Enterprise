$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$SmokeFile = Join-Path $env:TEMP "avos-genesis-v5-absolute-pack-1601-3200-smoke.cjs"

@'
const {
  GenesisV5AbsoluteRuntimeOrchestrator,
  GenesisV5AbsoluteRuntimeVerifier,
} = require(process.cwd() + "/dist/genesis-engine-v5-absolute-mega-pack-1601-3200");

const orchestrator =
  new GenesisV5AbsoluteRuntimeOrchestrator();

const result = orchestrator.execute({
  systemKey: "avos-absolute-enterprise",
  annualMetaBudget: 25000000000,
  enableRecursiveInnovation: true,
  enableInfiniteSimulation: true,
  enableSelfValidation: true,
  worlds: [
    "enterprise-world",
    "science-world",
    "infrastructure-world",
    "digital-society-world"
  ],
  federations: [
    "enterprise-federation",
    "science-federation",
    "governance-federation"
  ],
  capabilityDomains: [
    "planning",
    "execution",
    "governance",
    "simulation",
    "resilience",
    "discovery"
  ],
  innovationDomains: [
    "ai",
    "energy",
    "mobility",
    "finance",
    "materials"
  ],
  lawDomains: [
    "security",
    "privacy",
    "finance",
    "ai-governance",
    "infrastructure"
  ],
  memoryDomains: [
    "operational",
    "architectural",
    "strategic",
    "scientific",
    "world-state"
  ],
  infrastructureDomains: [
    "energy",
    "transport",
    "communications",
    "logistics",
    "digital-government"
  ],
  scientificDomains: [
    "artificial-intelligence",
    "materials",
    "energy",
    "mobility",
    "health"
  ],
  trustPrinciples: [
    "human-accountability",
    "security-first",
    "privacy-by-design",
    "auditability",
    "reversibility",
    "fairness"
  ]
});

const health =
  new GenesisV5AbsoluteRuntimeVerifier().verify(result);

if (!health.healthy) {
  console.error(JSON.stringify({ result, health }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  success: true,
  system: "AVOS Genesis Engine",
  bundle: "Genesis Engine v5 Absolute Mega Pack 1601-3200",
  version: "5.3200.0",
  status: health.status,
  score: health.score,
  worlds: health.worlds,
  federations: health.federations,
  capabilitySyntheses: health.capabilitySyntheses,
  innovationFlows: health.innovationFlows,
  lawRuntimes: health.lawRuntimes,
  simulationMeshes: health.simulationMeshes,
  infrastructureDomains: health.infrastructureDomains,
  readiness: health.readiness,
  healthStatus: "healthy"
}, null, 2));
'@ | Set-Content -Path $SmokeFile -Encoding UTF8

try {
    node $SmokeFile

    if ($LASTEXITCODE -ne 0) {
        throw "Genesis Engine v5 Absolute Mega Pack 1601-3200 smoke test failed."
    }
}
finally {
    Remove-Item $SmokeFile -Force -ErrorAction SilentlyContinue
}

$ErrorActionPreference = "Stop"
$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root
$SmokeFile = Join-Path $env:TEMP "avos-genesis-engine-v2-smoke.cjs"

@'
const {
  GenesisEngineV2,
  GenesisEngineV2RuntimeVerifier,
} = require(process.cwd() + "/dist/genesis-engine-v2");

const engine = new GenesisEngineV2();

const result = engine.execute({
  systemKey: "avos-autonomous-marketplace",
  name: "AVOS Autonomous Marketplace",
  description: "An AI-native enterprise marketplace with autonomous operations.",
  businessGoals: [
    "generate revenue",
    "automate marketplace operations",
    "optimize customer acquisition",
    "support enterprise governance"
  ],
  targetUsers: [
    "customers",
    "dealers",
    "operations teams",
    "enterprise administrators"
  ],
  domains: [
    "identity",
    "catalog",
    "pricing",
    "orders",
    "payments",
    "crm",
    "marketing",
    "analytics"
  ],
  constraints: [
    "security-first",
    "auditability",
    "modularity",
    "rollback-readiness",
    "uae-data-residency"
  ],
  nonFunctionalRequirements: {
    availability: 99.9,
    scalability: "horizontal",
    architecture: "event-driven",
    compliance: ["uae", "enterprise"]
  }
});

const health = new GenesisEngineV2RuntimeVerifier().verify(result);

if (!health.healthy) {
  console.error(JSON.stringify({ result, health }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  success: true,
  system: "AVOS Genesis Engine",
  bundle: "Genesis Engine v2 Foundation",
  version: "2.0.0",
  status: result.status,
  score: result.score,
  architectureStyle: result.blueprint.architecture.style,
  modules: health.modules,
  generationSteps: health.generationSteps,
  estimatedArtifacts: health.estimatedArtifacts,
  validationGates: health.validationGates,
  documentationItems: health.documentationItems,
  brainRegistrations: health.brainRegistrations,
  evolutionRegistrations: health.evolutionRegistrations,
  healthStatus: "healthy"
}, null, 2));
'@ | Set-Content -Path $SmokeFile -Encoding UTF8

try {
    node $SmokeFile
    if ($LASTEXITCODE -ne 0) {
        throw "Genesis Engine v2 smoke test failed."
    }
}
finally {
    Remove-Item $SmokeFile -Force -ErrorAction SilentlyContinue
}

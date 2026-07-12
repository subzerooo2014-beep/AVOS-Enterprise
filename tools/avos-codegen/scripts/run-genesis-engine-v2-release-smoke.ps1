$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$SmokeFile = Join-Path $env:TEMP "avos-genesis-engine-v2-release-smoke.cjs"

@'
const {
  GenesisReleaseOrchestrator,
  GenesisReleaseRuntimeVerifier,
} = require(process.cwd() + "/dist/genesis-engine-v2-release");

const orchestrator = new GenesisReleaseOrchestrator();

const result = orchestrator.execute({
  systemKey: "avos-autonomous-marketplace",
  currentVersion: "1.0.0",
  bump: "minor",
  workspaceDirectory: "generated/avos-autonomous-marketplace",
  architectureStyle: "event-driven-platform",
  capabilities: [
    "identity",
    "catalog",
    "orders",
    "payments"
  ],
  artifacts: [
    {
      relativePath: "src/identity/identity.service.ts",
      hash: "a".repeat(64),
      kind: "service",
      sizeBytes: 320
    },
    {
      relativePath: "src/catalog/catalog.service.ts",
      hash: "b".repeat(64),
      kind: "service",
      sizeBytes: 340
    },
    {
      relativePath: "README.md",
      hash: "c".repeat(64),
      kind: "documentation",
      sizeBytes: 250
    }
  ],
  promotion: {
    approved: true,
    strategy: "promote",
    qualityScore: 100,
    controls: ["continuous-observability"]
  },
  previousVersion: "1.0.0"
});

const health = new GenesisReleaseRuntimeVerifier().verify(result);

if (!health.healthy) {
  console.error(JSON.stringify({ result, health }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  success: true,
  system: "AVOS Genesis Engine",
  bundle: "Genesis Engine v2 Release & Registration",
  version: "2.4.0",
  status: result.status,
  releaseVersion: health.releaseVersion,
  artifactCount: health.artifactCount,
  qualityScore: health.qualityScore,
  enterpriseBrainRegistered: health.enterpriseBrainRegistered,
  evolutionCenterRegistered: health.evolutionCenterRegistered,
  rollbackSupported: health.rollbackSupported,
  healthStatus: "healthy"
}, null, 2));
'@ | Set-Content `
    -Path $SmokeFile `
    -Encoding UTF8

try {
    node $SmokeFile

    if ($LASTEXITCODE -ne 0) {
        throw "Genesis Engine v2 Release smoke test failed."
    }
}
finally {
    Remove-Item $SmokeFile -Force -ErrorAction SilentlyContinue
}

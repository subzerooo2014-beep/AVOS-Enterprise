$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$SmokeFile = Join-Path $env:TEMP "avos-genesis-engine-v2-e2e-smoke.cjs"
$WorkspaceRoot = Join-Path $env:TEMP "avos-genesis-v2-e2e-workspace"

Remove-Item $WorkspaceRoot `
    -Recurse `
    -Force `
    -ErrorAction SilentlyContinue

@'
const {
  GenesisEndToEndOrchestrator,
  GenesisEndToEndRuntimeVerifier,
} = require(process.cwd() + "/dist/genesis-engine-v2-e2e");

const workspaceRoot = process.argv[2];

(async () => {
  const orchestrator = new GenesisEndToEndOrchestrator();

  const result = await orchestrator.execute({
    outputDirectory: workspaceRoot,
    currentVersion: "1.0.0",
    versionBump: "minor",
    previousVersion: "1.0.0",
    overwrite: true,
    intent: {
      systemKey: "avos-generated-marketplace",
      name: "AVOS Generated Marketplace",
      description: "Generated marketplace produced end-to-end.",
      businessGoals: [
        "generate revenue",
        "automate operations",
        "support enterprise governance"
      ],
      targetUsers: [
        "customers",
        "operators",
        "administrators"
      ],
      domains: [
        "identity",
        "catalog",
        "orders",
        "payments"
      ],
      constraints: [
        "security-first",
        "auditability",
        "rollback-readiness"
      ],
      nonFunctionalRequirements: {
        availability: 99.9,
        architecture: "event-driven"
      }
    },
    validationGates: [
      {
        key: "workspace-exists",
        command: "node -e \"require('node:fs').accessSync('README.md')\"",
        required: true,
        timeoutMs: 30000,
        weight: 50
      },
      {
        key: "generated-index-exists",
        command: "node -e \"require('node:fs').accessSync('src/index.ts')\"",
        required: true,
        timeoutMs: 30000,
        weight: 50
      }
    ]
  });

  const health = new GenesisEndToEndRuntimeVerifier().verify(result);

  if (!health.healthy) {
    console.error(JSON.stringify({ result, health }, null, 2));
    process.exit(1);
  }

  console.log(JSON.stringify({
    success: true,
    system: "AVOS Genesis Engine",
    bundle: "Genesis Engine v2 End-to-End Pipeline",
    version: "2.5.0",
    status: result.status,
    failedStage: health.failedStage,
    blueprintScore: health.blueprintScore,
    generationScore: health.generationScore,
    validationScore: health.validationScore,
    releaseVersion: health.releaseVersion,
    artifacts: health.artifacts,
    healthStatus: "healthy"
  }, null, 2));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
'@ | Set-Content `
    -Path $SmokeFile `
    -Encoding UTF8

try {
    node $SmokeFile $WorkspaceRoot

    if ($LASTEXITCODE -ne 0) {
        throw "Genesis Engine v2 End-to-End smoke test failed."
    }
}
finally {
    Remove-Item $SmokeFile -Force -ErrorAction SilentlyContinue
    Remove-Item $WorkspaceRoot -Recurse -Force -ErrorAction SilentlyContinue
}

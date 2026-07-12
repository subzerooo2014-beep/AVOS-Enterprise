$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$SmokeFile = Join-Path $env:TEMP "avos-genesis-v3-runtime-validation-smoke.cjs"
$WorkspaceRoot = Join-Path $env:TEMP "avos-genesis-v3-runtime-validation-workspace"

Remove-Item $WorkspaceRoot `
    -Recurse `
    -Force `
    -ErrorAction SilentlyContinue

New-Item `
    -ItemType Directory `
    -Path $WorkspaceRoot `
    -Force |
Out-Null

@'
{
  "name": "avos-genesis-v3-runtime-smoke",
  "private": true,
  "scripts": {
    "install-check": "node -e \"process.exit(0)\"",
    "prisma-generate": "node -e \"process.exit(0)\"",
    "build": "node -e \"process.exit(0)\"",
    "test": "node -e \"process.exit(0)\"",
    "lint": "node -e \"process.exit(0)\"",
    "smoke": "node -e \"process.exit(0)\""
  }
}
'@ | Set-Content `
    -Path (Join-Path $WorkspaceRoot "package.json") `
    -Encoding UTF8

@'
const {
  GenesisV3RuntimeValidationOrchestrator,
  GenesisV3RuntimeValidationVerifier,
} = require(process.cwd() + "/dist/genesis-engine-v3-runtime-validation");

const workspaceRoot = process.argv[2];

(async () => {
  const orchestrator =
    new GenesisV3RuntimeValidationOrchestrator();

  const result = await orchestrator.execute({
    workspaceDirectory: workspaceRoot,
    stopOnRequiredFailure: true,
    commands: [
      {
        key: "install",
        command: "npm run install-check",
        required: true,
        timeoutMs: 30000,
        weight: 15
      },
      {
        key: "prisma-generate",
        command: "npm run prisma-generate",
        required: true,
        timeoutMs: 30000,
        weight: 15
      },
      {
        key: "build",
        command: "npm run build",
        required: true,
        timeoutMs: 30000,
        weight: 25
      },
      {
        key: "test",
        command: "npm run test",
        required: true,
        timeoutMs: 30000,
        weight: 20
      },
      {
        key: "lint",
        command: "npm run lint",
        required: true,
        timeoutMs: 30000,
        weight: 15
      },
      {
        key: "smoke",
        command: "npm run smoke",
        required: true,
        timeoutMs: 30000,
        weight: 10
      }
    ]
  });

  const health =
    new GenesisV3RuntimeValidationVerifier().verify(result);

  if (!health.healthy) {
    console.error(JSON.stringify({ result, health }, null, 2));
    process.exit(1);
  }

  console.log(JSON.stringify({
    success: true,
    system: "AVOS Genesis Engine",
    bundle: "Genesis Engine v3 Real Build & Runtime Validation",
    version: "3.2.0",
    status: health.status,
    qualityScore: health.qualityScore,
    runtimeReady: health.runtimeReady,
    rollbackRecommended: health.rollbackRecommended,
    commands: health.commands,
    passed: health.passed,
    failed: health.failed,
    requiredFailures: health.requiredFailures,
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
        throw "Genesis Engine v3 Runtime Validation smoke test failed."
    }
}
finally {
    Remove-Item $SmokeFile -Force -ErrorAction SilentlyContinue
    Remove-Item $WorkspaceRoot -Recurse -Force -ErrorAction SilentlyContinue
}

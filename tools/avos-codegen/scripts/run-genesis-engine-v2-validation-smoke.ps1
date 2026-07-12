$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$SmokeFile = Join-Path $env:TEMP "avos-genesis-engine-v2-validation-smoke.cjs"
$WorkspaceRoot = Join-Path $env:TEMP "avos-genesis-validation-workspace"

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
  "name": "avos-generated-validation-smoke",
  "private": true,
  "scripts": {
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
  GenesisValidationOrchestrator,
  GenesisValidationRuntimeVerifier,
} = require(process.cwd() + "/dist/genesis-engine-v2-validation");

const workspaceRoot = process.argv[2];

(async () => {
  const orchestrator = new GenesisValidationOrchestrator();

  const result = await orchestrator.execute({
    workspaceDirectory: workspaceRoot,
    stopOnRequiredFailure: true,
    gates: [
      {
        key: "build",
        command: "npm run build",
        required: true,
        timeoutMs: 30000,
        weight: 30
      },
      {
        key: "test",
        command: "npm run test",
        required: true,
        timeoutMs: 30000,
        weight: 30
      },
      {
        key: "lint",
        command: "npm run lint",
        required: true,
        timeoutMs: 30000,
        weight: 20
      },
      {
        key: "smoke",
        command: "npm run smoke",
        required: true,
        timeoutMs: 30000,
        weight: 20
      }
    ]
  });

  const health = new GenesisValidationRuntimeVerifier().verify(result);

  if (!health.healthy) {
    console.error(JSON.stringify({ result, health }, null, 2));
    process.exit(1);
  }

  console.log(JSON.stringify({
    success: true,
    system: "AVOS Genesis Engine",
    bundle: "Genesis Engine v2 Validation & Promotion",
    version: "2.3.0",
    status: result.status,
    qualityScore: health.qualityScore,
    gates: health.gates,
    passedGates: health.passedGates,
    failedGates: health.failedGates,
    requiredFailures: health.requiredFailures,
    promotionApproved: health.promotionApproved,
    promotionStrategy: health.promotionStrategy,
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
        throw "Genesis Engine v2 Validation smoke test failed."
    }
}
finally {
    Remove-Item $SmokeFile -Force -ErrorAction SilentlyContinue
    Remove-Item $WorkspaceRoot -Recurse -Force -ErrorAction SilentlyContinue
}

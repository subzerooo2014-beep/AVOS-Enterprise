$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$SmokeFile = Join-Path $env:TEMP "avos-genesis-final-execution-smoke.cjs"
$WorkspaceRoot = Join-Path $env:TEMP "avos-genesis-final-execution-workspace"

Remove-Item $WorkspaceRoot `
    -Recurse `
    -Force `
    -ErrorAction SilentlyContinue

@'
const {
  GenesisFinalExecutionOrchestrator,
  GenesisFinalExecutionRuntimeVerifier,
} = require(process.cwd() + "/dist/genesis-engine-final-execution");
const {
  GenesisV3RuntimeValidationOrchestrator,
} = require(process.cwd() + "/dist/genesis-engine-v3-runtime-validation");

const workspaceRoot = process.argv[2];

class SmokeRuntimeValidator extends GenesisV3RuntimeValidationOrchestrator {
  defaultCommands() {
    return [
      {
        key: "install",
        command: "node -e \"process.exit(0)\"",
        required: true,
        timeoutMs: 30000,
        weight: 15
      },
      {
        key: "prisma-generate",
        command: "node -e \"process.exit(0)\"",
        required: true,
        timeoutMs: 30000,
        weight: 15
      },
      {
        key: "build",
        command: "node -e \"process.exit(0)\"",
        required: true,
        timeoutMs: 30000,
        weight: 25
      },
      {
        key: "test",
        command: "node -e \"process.exit(0)\"",
        required: true,
        timeoutMs: 30000,
        weight: 20
      },
      {
        key: "lint",
        command: "node -e \"process.exit(0)\"",
        required: true,
        timeoutMs: 30000,
        weight: 15
      },
      {
        key: "smoke",
        command: "node -e \"process.exit(0)\"",
        required: true,
        timeoutMs: 30000,
        weight: 10
      }
    ];
  }
}

(async () => {
  const orchestrator = new GenesisFinalExecutionOrchestrator(
    undefined,
    undefined,
    new SmokeRuntimeValidator(),
    undefined
  );

  const result = await orchestrator.execute({
    outputDirectory: workspaceRoot,
    currentVersion: "1.0.0",
    versionBump: "minor",
    previousVersion: "1.0.0",
    overwrite: true,
    specification: {
      systemKey: "avos-final-execution-system",
      systemName: "AVOS Final Execution System",
      description: "Final end-to-end generated system.",
      domains: [
        {
          key: "customers",
          entityName: "Customer",
          fields: [
            {
              name: "name",
              type: "string",
              required: true
            },
            {
              name: "email",
              type: "string",
              required: true,
              unique: true
            }
          ]
        },
        {
          key: "orders",
          entityName: "Order",
          fields: [
            {
              name: "reference",
              type: "string",
              required: true,
              unique: true
            },
            {
              name: "total",
              type: "number",
              required: true
            }
          ]
        }
      ],
      frontend: {
        enabled: true,
        title: "AVOS Final Execution System"
      },
      database: {
        provider: "postgresql"
      },
      docker: true,
      ci: true
    }
  });

  const health =
    new GenesisFinalExecutionRuntimeVerifier().verify(result);

  if (!health.healthy) {
    console.error(JSON.stringify({ result, health }, null, 2));
    process.exit(1);
  }

  console.log(JSON.stringify({
    success: true,
    system: "AVOS Genesis Engine",
    bundle: "Genesis Engine Final Execution Pack",
    version: "3.3.0",
    stage: health.stage,
    generatedArtifacts: health.generatedArtifacts,
    materializedOperations: health.materializedOperations,
    validationCommands: health.validationCommands,
    qualityScore: health.qualityScore,
    runtimeReady: health.runtimeReady,
    releaseVersion: health.releaseVersion,
    enterpriseBrainRegistered: health.enterpriseBrainRegistered,
    evolutionCenterRegistered: health.evolutionCenterRegistered,
    blueprintRegistryRegistered: health.blueprintRegistryRegistered,
    artifactRegistryEntries: health.artifactRegistryEntries,
    replayManifestCreated: health.replayManifestCreated,
    rollbackExecuted: health.rollbackExecuted,
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
        throw "Genesis Engine Final Execution smoke test failed."
    }
}
finally {
    Remove-Item $SmokeFile -Force -ErrorAction SilentlyContinue
    Remove-Item $WorkspaceRoot -Recurse -Force -ErrorAction SilentlyContinue
}

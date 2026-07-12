$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$SmokeFile = Join-Path $env:TEMP "avos-genesis-engine-v2-execution-smoke.cjs"

@'
const {
  GenesisExecutionOrchestrator,
  GenesisExecutionRuntimeVerifier,
} = require(process.cwd() + "/dist/genesis-engine-v2-execution");

const orchestrator = new GenesisExecutionOrchestrator();

const result = orchestrator.execute({
  outputDirectory: "generated/avos-autonomous-marketplace",
  overwrite: false,
  blueprint: {
    systemKey: "avos-autonomous-marketplace",
    systemName: "AVOS Autonomous Marketplace",
    architectureStyle: "event-driven-platform",
    modules: [
      {
        key: "identity",
        responsibilities: [
          "manage-identity",
          "validate-identity",
          "publish-identity-events"
        ],
        dependencies: []
      },
      {
        key: "catalog",
        responsibilities: [
          "manage-catalog",
          "validate-catalog",
          "publish-catalog-events"
        ],
        dependencies: ["identity"]
      },
      {
        key: "orders",
        responsibilities: [
          "manage-orders",
          "validate-orders",
          "publish-order-events"
        ],
        dependencies: ["identity", "catalog"]
      },
      {
        key: "payments",
        responsibilities: [
          "manage-payments",
          "validate-payments",
          "publish-payment-events"
        ],
        dependencies: ["orders"]
      }
    ],
    validationGates: [
      "typescript-build",
      "architecture-validation",
      "security-validation",
      "integration-validation",
      "smoke-validation"
    ],
    documentationPlan: [
      "system-overview",
      "architecture-decisions",
      "api-reference",
      "runbook"
    ],
    brainRegistrations: [
      "system-intent",
      "domain-map",
      "architecture-decisions",
      "capability-catalog"
    ],
    evolutionRegistrations: [
      "baseline-version",
      "health-thresholds",
      "improvement-signals"
    ]
  }
});

const health = new GenesisExecutionRuntimeVerifier().verify(result);

if (!health.healthy) {
  console.error(JSON.stringify({ result, health }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  success: true,
  system: "AVOS Genesis Engine",
  bundle: "Genesis Engine v2 Execution",
  version: "2.1.0",
  status: result.status,
  score: result.score,
  artifacts: health.artifacts,
  modules: health.modules,
  controllers: health.controllers,
  services: health.services,
  dtos: health.dtos,
  tests: health.tests,
  documentation: health.documentation,
  registrations: health.registrations,
  directories: health.directories,
  validationCommands: health.validationCommands,
  healthStatus: "healthy"
}, null, 2));
'@ | Set-Content -Path $SmokeFile -Encoding UTF8

try {
    node $SmokeFile

    if ($LASTEXITCODE -ne 0) {
        throw "Genesis Engine v2 Execution smoke test failed."
    }
}
finally {
    Remove-Item $SmokeFile -Force -ErrorAction SilentlyContinue
}

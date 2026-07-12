$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$SmokeFile = Join-Path $env:TEMP "avos-genesis-v5-pack-16-20-smoke.cjs"

@'
const {
  GenesisV5OperationsRuntimeOrchestrator,
  GenesisV5OperationsRuntimeVerifier,
} = require(process.cwd() + "/dist/genesis-engine-v5-mega-pack-16-20");

const orchestrator =
  new GenesisV5OperationsRuntimeOrchestrator();

const result = orchestrator.execute({
  systemKey: "avos-automotive-marketplace",
  enableAutoRemediation: true,
  enableRollback: true,
  enableCapacityAutomation: true,
  enableEvidence: true,
  services: [
    {
      key: "customers-service",
      criticality: "high",
      dependencies: [],
      targetAvailability: 99.95,
      targetLatencyMs: 250
    },
    {
      key: "vehicles-service",
      criticality: "high",
      dependencies: ["customers-service"],
      targetAvailability: 99.95,
      targetLatencyMs: 300
    },
    {
      key: "orders-service",
      criticality: "high",
      dependencies: [
        "customers-service",
        "vehicles-service"
      ],
      targetAvailability: 99.95,
      targetLatencyMs: 350
    },
    {
      key: "payments-service",
      criticality: "high",
      dependencies: ["orders-service"],
      targetAvailability: 99.99,
      targetLatencyMs: 250
    }
  ]
});

const health =
  new GenesisV5OperationsRuntimeVerifier().verify(result);

if (!health.healthy) {
  console.error(JSON.stringify({ result, health }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  success: true,
  system: "AVOS Genesis Engine",
  bundle: "Genesis Engine v5 Mega Pack 16-20",
  version: "5.20.0",
  status: health.status,
  score: health.score,
  slos: health.slos,
  incidentRules: health.incidentRules,
  runbooks: health.runbooks,
  remediations: health.remediations,
  capacityDecisions: health.capacityDecisions,
  rollbackPolicies: health.rollbackPolicies,
  resiliencePolicies: health.resiliencePolicies,
  operationalEvidence: health.operationalEvidence,
  alertRoutes: health.alertRoutes,
  healthStatus: "healthy"
}, null, 2));
'@ | Set-Content -Path $SmokeFile -Encoding UTF8

try {
    node $SmokeFile

    if ($LASTEXITCODE -ne 0) {
        throw "Genesis Engine v5 Mega Pack 16-20 smoke test failed."
    }
}
finally {
    Remove-Item $SmokeFile -Force -ErrorAction SilentlyContinue
}

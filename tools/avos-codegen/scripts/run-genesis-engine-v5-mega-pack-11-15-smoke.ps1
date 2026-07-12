$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$SmokeFile = Join-Path $env:TEMP "avos-genesis-v5-pack-11-15-smoke.cjs"

@'
const {
  GenesisV5AgentRuntimeOrchestrator,
  GenesisV5AgentRuntimeVerifier,
} = require(process.cwd() + "/dist/genesis-engine-v5-mega-pack-11-15");

const orchestrator =
  new GenesisV5AgentRuntimeOrchestrator();

const result = orchestrator.execute({
  systemKey: "avos-automotive-marketplace",
  enableGuardrails: true,
  enableHumanApproval: true,
  enableMemory: true,
  workflows: [
    {
      key: "vehicle-publishing",
      trigger: "vehicle.submitted",
      goals: [
        "validate vehicle listing",
        "assess fraud risk",
        "publish approved vehicle"
      ],
      domains: ["vehicles", "customers", "advertisements"],
      criticality: "high"
    },
    {
      key: "order-fulfillment",
      trigger: "order.created",
      goals: [
        "validate order",
        "authorize payment",
        "confirm fulfillment"
      ],
      domains: ["orders", "payments"],
      criticality: "high"
    }
  ],
  agents: [
    {
      key: "listing-quality-agent",
      role: "Validate listing completeness and quality",
      goals: ["validate vehicle listing"],
      tools: [
        "vehicle-read",
        "vehicle-update",
        "listing-score"
      ],
      memoryRequired: true,
      humanApprovalRequired: false
    },
    {
      key: "fraud-assessment-agent",
      role: "Assess marketplace fraud risk",
      goals: ["assess fraud risk"],
      tools: [
        "vehicle-read",
        "customer-read",
        "fraud-score"
      ],
      memoryRequired: true,
      humanApprovalRequired: true
    },
    {
      key: "payment-agent",
      role: "Authorize and reconcile payments",
      goals: ["authorize payment"],
      tools: [
        "payment-authorize",
        "payment-void",
        "payment-read"
      ],
      memoryRequired: true,
      humanApprovalRequired: true
    }
  ]
});

const health =
  new GenesisV5AgentRuntimeVerifier().verify(result);

if (!health.healthy) {
  console.error(JSON.stringify({ result, health }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  success: true,
  system: "AVOS Genesis Engine",
  bundle: "Genesis Engine v5 Mega Pack 11-15",
  version: "5.15.0",
  status: health.status,
  score: health.score,
  workflows: health.workflows,
  agents: health.agents,
  tools: health.tools,
  guardrails: health.guardrails,
  memoryPlans: health.memoryPlans,
  workflowTests: health.workflowTests,
  agentTests: health.agentTests,
  guardrailTests: health.guardrailTests,
  healthStatus: "healthy"
}, null, 2));
'@ | Set-Content -Path $SmokeFile -Encoding UTF8

try {
    node $SmokeFile

    if ($LASTEXITCODE -ne 0) {
        throw "Genesis Engine v5 Mega Pack 11-15 smoke test failed."
    }
}
finally {
    Remove-Item $SmokeFile -Force -ErrorAction SilentlyContinue
}

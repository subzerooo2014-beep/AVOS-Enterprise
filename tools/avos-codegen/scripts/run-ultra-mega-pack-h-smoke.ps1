$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$SmokeFile = Join-Path $env:TEMP "avos-ultra-mega-pack-h-smoke.cjs"

@'
const {
  EnterpriseControlOrchestratorV5,
  UltraMegaPackHRuntimeVerifier,
} = require(process.cwd() + "/dist/ultra-mega-pack-h");

const orchestrator = new EnterpriseControlOrchestratorV5();

const result = orchestrator.execute({
  systemKey: "avos-enterprise",
  commandCenterMetrics: [
    {
      key: "platform-availability",
      domain: "operations",
      value: 99,
      target: 99,
      weight: 1,
      metadata: {}
    },
    {
      key: "security-posture",
      domain: "security",
      value: 94,
      target: 95,
      weight: 2,
      metadata: {}
    },
    {
      key: "customer-satisfaction",
      domain: "customers",
      value: 91,
      target: 90,
      weight: 1,
      metadata: {}
    },
    {
      key: "ai-automation-coverage",
      domain: "ai",
      value: 88,
      target: 90,
      weight: 1,
      metadata: {}
    }
  ],
  predictiveSignals: [
    {
      key: "api-capacity",
      category: "capacity",
      current: 62,
      previous: 55,
      threshold: 90,
      horizonHours: 12
    },
    {
      key: "security-incidents",
      category: "security",
      current: 8,
      previous: 10,
      threshold: 25,
      horizonHours: 12
    }
  ],
  resourcePools: [
    {
      key: "compute-pool",
      type: "compute",
      available: 100,
      reserved: 20,
      unitCost: 2
    },
    {
      key: "agent-pool",
      type: "agents",
      available: 20,
      reserved: 4,
      unitCost: 10
    }
  ],
  resourceDemands: [
    {
      key: "codegen-runtime",
      poolKey: "compute-pool",
      requested: 40,
      priority: 95,
      minimum: 25,
      maximum: 50
    },
    {
      key: "strategic-agent-capacity",
      poolKey: "agent-pool",
      requested: 8,
      priority: 90,
      minimum: 5,
      maximum: 10
    }
  ],
  councilVotes: [
    {
      agentKey: "architecture-agent",
      expertise: ["architecture", "generation"],
      recommendation: "approve",
      confidence: 94,
      rationale: "Architecture and compatibility checks passed.",
      controls: ["progressive-observability"],
      metadata: {}
    },
    {
      agentKey: "security-agent",
      expertise: ["security", "governance"],
      recommendation: "approve_with_controls",
      confidence: 92,
      rationale: "Security posture is acceptable with continuous monitoring.",
      controls: ["continuous-security-monitoring"],
      metadata: {}
    },
    {
      agentKey: "operations-agent",
      expertise: ["operations", "reliability"],
      recommendation: "approve",
      confidence: 90,
      rationale: "Operational readiness confirmed.",
      controls: ["automatic-rollback"],
      metadata: {}
    }
  ],
  controlCommands: [
    {
      key: "scale-codegen-runtime",
      targetSystem: "codegen-runtime",
      action: "scale",
      priority: 95,
      requiresApproval: false,
      payload: { replicas: 6 }
    },
    {
      key: "activate-security-observability",
      targetSystem: "security-runtime",
      action: "enable-monitoring",
      priority: 90,
      requiresApproval: false,
      payload: { mode: "continuous" }
    }
  ]
});

const health = new UltraMegaPackHRuntimeVerifier().verify(result);

if (!health.healthy) {
  console.error(JSON.stringify({ result, health }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  success: true,
  system: "AVOS CodeGen OS",
  bundle: "Ultra Mega Pack H",
  packs: "51-55",
  status: result.status,
  score: result.score,
  enterpriseScore: health.enterpriseScore,
  directives: health.directives,
  forecasts: health.forecasts,
  interventionForecasts: health.interventionForecasts,
  resourceAllocations: health.resourceAllocations,
  fullySatisfiedAllocations: health.fullySatisfiedAllocations,
  councilDecision: health.councilDecision,
  councilConsensus: health.councilConsensus,
  routedCommands: health.routedCommands,
  approvalRequiredCommands: health.approvalRequiredCommands,
  healthStatus: "healthy"
}, null, 2));
'@ | Set-Content -Path $SmokeFile -Encoding UTF8

try {
    node $SmokeFile
    if ($LASTEXITCODE -ne 0) {
        throw "Ultra Mega Pack H smoke test failed."
    }
}
finally {
    Remove-Item $SmokeFile -Force -ErrorAction SilentlyContinue
}

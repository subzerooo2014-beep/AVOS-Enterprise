$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$SmokeFile = Join-Path $env:TEMP "avos-ultra-mega-pack-g-smoke.cjs"

@'
const {
  EnterpriseOperationsOrchestratorV4,
  UltraGSeverity,
  UltraMegaPackGRuntimeVerifier,
} = require(process.cwd() + "/dist/ultra-mega-pack-g");

const orchestrator = new EnterpriseOperationsOrchestratorV4();

const result = orchestrator.execute({
  systemKey: "avos-enterprise",
  operationalSignals: [
    {
      key: "api-latency",
      category: "latency",
      value: 55,
      warningThreshold: 70,
      criticalThreshold: 90,
      metadata: {}
    },
    {
      key: "capacity-utilization",
      category: "capacity",
      value: 72,
      warningThreshold: 75,
      criticalThreshold: 92,
      metadata: {}
    },
    {
      key: "security-risk",
      category: "security",
      value: 20,
      warningThreshold: 60,
      criticalThreshold: 85,
      metadata: {}
    }
  ],
  runtimeFaults: [
    {
      key: "worker-timeout",
      component: "ai-worker",
      severity: UltraGSeverity.WARNING,
      recoverable: true,
      retryCount: 1
    },
    {
      key: "event-consumer-stall",
      component: "event-consumer",
      severity: UltraGSeverity.ERROR,
      recoverable: true,
      retryCount: 3
    }
  ],
  simulationScenarios: [
    {
      key: "balanced-growth",
      loadMultiplier: 1.4,
      failureProbability: 12,
      costMultiplier: 1.1,
      changeMagnitude: 25
    },
    {
      key: "aggressive-growth",
      loadMultiplier: 2.5,
      failureProbability: 28,
      costMultiplier: 1.7,
      changeMagnitude: 55
    }
  ],
  agents: [
    {
      agentKey: "operations-agent",
      capabilities: ["operations", "recovery"],
      reliability: 95,
      currentLoad: 30
    },
    {
      agentKey: "innovation-agent",
      capabilities: ["innovation", "analysis"],
      reliability: 92,
      currentLoad: 25
    },
    {
      agentKey: "simulation-agent",
      capabilities: ["simulation", "analysis"],
      reliability: 90,
      currentLoad: 20
    }
  ],
  tasks: [
    {
      key: "optimize-runtime",
      requiredCapability: "operations",
      priority: 95,
      dependencies: []
    },
    {
      key: "evaluate-growth-scenarios",
      requiredCapability: "simulation",
      priority: 88,
      dependencies: []
    },
    {
      key: "generate-innovation-roadmap",
      requiredCapability: "innovation",
      priority: 85,
      dependencies: []
    }
  ],
  innovationSignals: [
    {
      key: "adaptive-pricing",
      source: "market",
      opportunityScore: 94,
      evidenceStrength: 90,
      implementationComplexity: 35
    },
    {
      key: "predictive-maintenance",
      source: "operations",
      opportunityScore: 88,
      evidenceStrength: 92,
      implementationComplexity: 30
    }
  ]
});

const health = new UltraMegaPackGRuntimeVerifier().verify(result);

if (!health.healthy) {
  console.error(JSON.stringify({ result, health }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  success: true,
  system: "AVOS CodeGen OS",
  bundle: "Ultra Mega Pack G",
  packs: "46-50",
  status: result.status,
  score: result.score,
  operationalHealth: health.operationalHealth,
  operationalActions: health.operationalActions,
  recoveredFaults: health.recoveredFaults,
  failedRecoveries: health.failedRecoveries,
  simulationScenarios: health.simulationScenarios,
  bestScenarioKey: health.bestScenarioKey,
  assignedTasks: health.assignedTasks,
  unassignedTasks: health.unassignedTasks,
  innovationProposals: health.innovationProposals,
  healthStatus: "healthy"
}, null, 2));
'@ | Set-Content -Path $SmokeFile -Encoding UTF8

try {
    node $SmokeFile
    if ($LASTEXITCODE -ne 0) {
        throw "Ultra Mega Pack G smoke test failed."
    }
}
finally {
    Remove-Item $SmokeFile -Force -ErrorAction SilentlyContinue
}

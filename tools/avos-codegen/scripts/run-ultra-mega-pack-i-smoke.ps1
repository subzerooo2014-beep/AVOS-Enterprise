$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$SmokeFile = Join-Path $env:TEMP "avos-ultra-mega-pack-i-smoke.cjs"

@'
const {
  EnterpriseSingularityOrchestratorV6,
  UltraMegaPackIRuntimeVerifier,
} = require(process.cwd() + "/dist/ultra-mega-pack-i");

const orchestrator = new EnterpriseSingularityOrchestratorV6();

const result = orchestrator.execute({
  systemKey: "avos-enterprise",
  twinEntities: [
    {
      key: "codegen-runtime",
      type: "system",
      status: "healthy",
      metrics: {
        availability: 99,
        throughput: 92
      },
      metadata: {}
    },
    {
      key: "genesis-engine",
      type: "service",
      status: "healthy",
      metrics: {
        availability: 98,
        throughput: 90
      },
      metadata: {}
    },
    {
      key: "enterprise-brain",
      type: "agent",
      status: "healthy",
      metrics: {
        availability: 97,
        throughput: 88
      },
      metadata: {}
    }
  ],
  twinScenario: {
    key: "scaled-enterprise",
    projectedMetrics: {
      availability: 99.5,
      throughput: 96
    },
    assumptions: {
      resourceExpansion: true
    }
  },
  policies: [
    {
      key: "security-first",
      authority: 98,
      riskTolerance: 10,
      mandatory: true,
      desiredOutcome: "approve-with-controls",
      controls: ["continuous-security-monitoring"]
    },
    {
      key: "operational-continuity",
      authority: 92,
      riskTolerance: 20,
      mandatory: true,
      desiredOutcome: "approve-with-controls",
      controls: ["automatic-rollback"]
    },
    {
      key: "cost-efficiency",
      authority: 80,
      riskTolerance: 35,
      mandatory: false,
      desiredOutcome: "approve-with-controls",
      controls: ["budget-observability"]
    }
  ],
  fabricNodes: [
    {
      key: "hybrid-primary",
      environment: "hybrid",
      capabilities: ["generation", "reasoning", "coordination"],
      capacity: 100,
      currentLoad: 30
    },
    {
      key: "cloud-secondary",
      environment: "cloud",
      capabilities: ["generation", "simulation"],
      capacity: 80,
      currentLoad: 20
    }
  ],
  fabricTasks: [
    {
      key: "generate-enterprise-system",
      requiredCapability: "generation",
      workload: 30,
      dependencies: []
    },
    {
      key: "coordinate-enterprise-engines",
      requiredCapability: "coordination",
      workload: 20,
      dependencies: ["generate-enterprise-system"]
    }
  ],
  memoryEntries: [
    {
      key: "previous-scale-event",
      event: "enterprise-scale-up",
      decision: "progressive-scale-with-observability",
      outcomeScore: 94,
      lessons: [
        "scale progressively",
        "keep rollback ready"
      ],
      context: {
        environment: "hybrid",
        risk: "medium"
      }
    }
  ],
  memoryQuery: {
    event: "enterprise-scale-up",
    contextKeys: ["environment", "risk"]
  },
  singularityEngines: [
    {
      key: "codegen-os",
      layer: "codegen",
      readiness: 96,
      capabilities: ["generation"]
    },
    {
      key: "genesis-engine",
      layer: "genesis",
      readiness: 94,
      capabilities: ["orchestration"]
    },
    {
      key: "enterprise-brain",
      layer: "brain",
      readiness: 93,
      capabilities: ["reasoning"]
    },
    {
      key: "evolution-center",
      layer: "evolution",
      readiness: 92,
      capabilities: ["self-evolution"]
    },
    {
      key: "operations-center",
      layer: "operations",
      readiness: 95,
      capabilities: ["operations"]
    },
    {
      key: "control-plane",
      layer: "control",
      readiness: 94,
      capabilities: ["control"]
    }
  ]
});

const health = new UltraMegaPackIRuntimeVerifier().verify(result);

if (!health.healthy) {
  console.error(JSON.stringify({ result, health }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  success: true,
  system: "AVOS CodeGen OS",
  bundle: "Ultra Mega Pack I",
  packs: "56-60",
  status: result.status,
  score: result.score,
  twinHealth: health.twinHealth,
  twinEntities: health.twinEntities,
  twinDeltas: health.twinDeltas,
  policyAgreed: health.policyAgreed,
  policyConfidence: health.policyConfidence,
  fabricRoutes: health.fabricRoutes,
  unroutedTasks: health.unroutedTasks,
  memorySize: health.memorySize,
  memorySimilarity: health.memorySimilarity,
  singularityCoordinated: health.singularityCoordinated,
  singularityReadiness: health.singularityReadiness,
  healthStatus: "healthy"
}, null, 2));
'@ | Set-Content -Path $SmokeFile -Encoding UTF8

try {
    node $SmokeFile
    if ($LASTEXITCODE -ne 0) {
        throw "Ultra Mega Pack I smoke test failed."
    }
}
finally {
    Remove-Item $SmokeFile -Force -ErrorAction SilentlyContinue
}

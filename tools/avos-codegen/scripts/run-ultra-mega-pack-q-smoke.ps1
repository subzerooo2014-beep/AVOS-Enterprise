$ErrorActionPreference = "Stop"
$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root
$SmokeFile = Join-Path $env:TEMP "avos-ultra-mega-pack-q-smoke.cjs"

@'
const {
  EnterpriseApexOrchestratorV14,
  UltraMegaPackQRuntimeVerifier,
} = require(process.cwd() + "/dist/ultra-mega-pack-q");

const orchestrator = new EnterpriseApexOrchestratorV14();

const result = orchestrator.execute({
  systemKey: "avos-enterprise",
  consciousnessSignals: [
    {
      key: "operational-awareness",
      domain: "operations",
      awareness: 96,
      confidence: 95,
      urgency: 20,
      context: { availability: 99, resilience: 96 }
    },
    {
      key: "financial-awareness",
      domain: "finance",
      awareness: 94,
      confidence: 93,
      urgency: 25,
      context: { liquidity: "strong", treasury: "optimized" }
    },
    {
      key: "governance-awareness",
      domain: "governance",
      awareness: 98,
      confidence: 97,
      urgency: 15,
      context: { constitution: "active", oversight: "continuous" }
    }
  ],
  covenantClauses: [
    {
      key: "security-covenant",
      authority: 99,
      mandatory: true,
      desiredOutcome: "approve-with-controls",
      controls: ["continuous-security-monitoring"]
    },
    {
      key: "operations-covenant",
      authority: 96,
      mandatory: true,
      desiredOutcome: "approve-with-controls",
      controls: ["automatic-rollback"]
    },
    {
      key: "finance-covenant",
      authority: 94,
      mandatory: false,
      desiredOutcome: "approve-with-controls",
      controls: ["treasury-observability"]
    }
  ],
  multiverseScenarios: [
    {
      key: "balanced-expansion",
      growth: 94,
      resilience: 96,
      governance: 95,
      risk: 18,
      cost: 30
    },
    {
      key: "aggressive-expansion",
      growth: 99,
      resilience: 88,
      governance: 90,
      risk: 42,
      cost: 55
    },
    {
      key: "defensive-stability",
      growth: 78,
      resilience: 99,
      governance: 97,
      risk: 10,
      cost: 20
    }
  ],
  knowledgeEntries: [
    {
      key: "transcendent-runtime-v13",
      source: "ultra-mega-pack-p",
      payload: { version: "95.0.0", status: "verified" }
    },
    {
      key: "apex-runtime-v14",
      source: "ultra-mega-pack-q",
      payload: { version: "100.0.0", status: "active" }
    }
  ],
  apexRuntimes: [
    {
      key: "consciousness-runtime",
      layer: "consciousness",
      readiness: 98,
      autonomy: 94
    },
    {
      key: "arbitration-runtime",
      layer: "arbitration",
      readiness: 97,
      autonomy: 93
    },
    {
      key: "simulation-runtime",
      layer: "simulation",
      readiness: 96,
      autonomy: 92
    },
    {
      key: "knowledge-runtime",
      layer: "knowledge",
      readiness: 99,
      autonomy: 95
    },
    {
      key: "governance-runtime",
      layer: "governance",
      readiness: 98,
      autonomy: 94
    },
    {
      key: "operations-runtime",
      layer: "operations",
      readiness: 97,
      autonomy: 96
    }
  ]
});

const health = new UltraMegaPackQRuntimeVerifier().verify(result);

if (!health.healthy) {
  console.error(JSON.stringify({ result, health }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  success: true,
  system: "AVOS CodeGen OS",
  bundle: "Ultra Mega Pack Q",
  packs: "96-100",
  status: result.status,
  score: result.score,
  consciousnessScore: health.consciousnessScore,
  consciousnessInsights: health.consciousnessInsights,
  arbitrationResolved: health.arbitrationResolved,
  arbitrationConfidence: health.arbitrationConfidence,
  multiverseScore: health.multiverseScore,
  multiverseScenarios: health.multiverseScenarios,
  bestScenarioKey: health.bestScenarioKey,
  knowledgeRecords: health.knowledgeRecords,
  knowledgeGeneration: health.knowledgeGeneration,
  knowledgeLineageVerified: health.knowledgeLineageVerified,
  knowledgeSourceCount: health.knowledgeSourceCount,
  apexActive: health.apexActive,
  apexReadiness: health.apexReadiness,
  apexAutonomy: health.apexAutonomy,
  healthStatus: "healthy"
}, null, 2));
'@ | Set-Content -Path $SmokeFile -Encoding UTF8

try {
    node $SmokeFile
    if ($LASTEXITCODE -ne 0) {
        throw "Ultra Mega Pack Q smoke test failed."
    }
}
finally {
    Remove-Item $SmokeFile -Force -ErrorAction SilentlyContinue
}

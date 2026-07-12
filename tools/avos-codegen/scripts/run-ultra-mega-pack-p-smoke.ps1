$ErrorActionPreference = "Stop"
$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root
$SmokeFile = Join-Path $env:TEMP "avos-ultra-mega-pack-p-smoke.cjs"

@'
const {
  EnterpriseTranscendentOrchestratorV13,
  UltraMegaPackPRuntimeVerifier,
} = require(process.cwd() + "/dist/ultra-mega-pack-p");

const orchestrator = new EnterpriseTranscendentOrchestratorV13();

const result = orchestrator.execute({
  systemKey: "avos-enterprise",
  intelligenceMembers: [
    {
      key: "enterprise-brain",
      authority: 98,
      reliability: 97,
      alignment: 96,
      controls: ["explainability", "auditability"]
    },
    {
      key: "genesis-engine",
      authority: 95,
      reliability: 96,
      alignment: 94,
      controls: ["rollback-readiness", "validation"]
    },
    {
      key: "control-plane",
      authority: 99,
      reliability: 98,
      alignment: 97,
      controls: ["constitutional-governance", "oversight"]
    }
  ],
  civilizationOffers: [
    {
      key: "knowledge-offer",
      provider: "knowledge-continuum",
      category: "knowledge",
      valueScore: 96,
      trustScore: 97,
      capacity: 100
    },
    {
      key: "capability-offer",
      provider: "capability-exchange",
      category: "capability",
      valueScore: 95,
      trustScore: 96,
      capacity: 95
    }
  ],
  civilizationDemands: [
    {
      key: "knowledge-demand",
      category: "knowledge",
      minimumValue: 90,
      minimumTrust: 90,
      requestedCapacity: 60
    },
    {
      key: "capability-demand",
      category: "capability",
      minimumValue: 90,
      minimumTrust: 90,
      requestedCapacity: 50
    }
  ],
  realitySignals: [
    {
      key: "enterprise-growth",
      current: 80,
      trend: 3,
      volatility: 10,
      horizon: 4,
      weight: 1
    },
    {
      key: "operational-resilience",
      current: 92,
      trend: 1,
      volatility: 6,
      horizon: 4,
      weight: 1
    }
  ],
  knowledgeEntries: [
    {
      key: "omni-coordination-v12",
      payload: {
        version: "90.0.0",
        status: "verified"
      },
      replicas: 4
    },
    {
      key: "transcendent-coordination-v13",
      payload: {
        version: "95.0.0",
        status: "active"
      },
      replicas: 5
    }
  ],
  transcendentRuntimes: [
    {
      key: "intelligence-covenant-runtime",
      layer: "intelligence",
      readiness: 98,
      autonomy: 94
    },
    {
      key: "civilization-exchange-runtime",
      layer: "exchange",
      readiness: 96,
      autonomy: 92
    },
    {
      key: "reality-forecasting-runtime",
      layer: "forecasting",
      readiness: 95,
      autonomy: 91
    },
    {
      key: "knowledge-resilience-runtime",
      layer: "knowledge",
      readiness: 99,
      autonomy: 93
    },
    {
      key: "governance-runtime",
      layer: "governance",
      readiness: 98,
      autonomy: 92
    },
    {
      key: "operations-runtime",
      layer: "operations",
      readiness: 97,
      autonomy: 95
    }
  ]
});

const health = new UltraMegaPackPRuntimeVerifier().verify(result);

if (!health.healthy) {
  console.error(JSON.stringify({ result, health }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  success: true,
  system: "AVOS CodeGen OS",
  bundle: "Ultra Mega Pack P",
  packs: "91-95",
  status: result.status,
  score: result.score,
  covenantRatified: health.covenantRatified,
  covenantScore: health.covenantScore,
  covenantMembers: health.covenantMembers,
  exchangeMatches: health.exchangeMatches,
  unmatchedDemands: health.unmatchedDemands,
  exchangeScore: health.exchangeScore,
  forecasts: health.forecasts,
  forecastScore: health.forecastScore,
  knowledgeRecords: health.knowledgeRecords,
  knowledgeGeneration: health.knowledgeGeneration,
  knowledgeIntegrityVerified: health.knowledgeIntegrityVerified,
  knowledgeReplicaScore: health.knowledgeReplicaScore,
  transcendentActive: health.transcendentActive,
  transcendentReadiness: health.transcendentReadiness,
  transcendentAutonomy: health.transcendentAutonomy,
  healthStatus: "healthy"
}, null, 2));
'@ | Set-Content -Path $SmokeFile -Encoding UTF8

try {
    node $SmokeFile
    if ($LASTEXITCODE -ne 0) { throw "Ultra Mega Pack P smoke test failed." }
}
finally {
    Remove-Item $SmokeFile -Force -ErrorAction SilentlyContinue
}

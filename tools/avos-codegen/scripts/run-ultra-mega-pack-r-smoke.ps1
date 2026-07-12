$ErrorActionPreference = "Stop"
$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root
$SmokeFile = Join-Path $env:TEMP "avos-ultra-mega-pack-r-smoke.cjs"

@'
const {
  EnterpriseZenithOrchestratorV15,
  UltraMegaPackRRuntimeVerifier,
} = require(process.cwd() + "/dist/ultra-mega-pack-r");

const orchestrator = new EnterpriseZenithOrchestratorV15();

const result = orchestrator.execute({
  systemKey: "avos-enterprise",
  intents: [
    {
      key: "enterprise-expansion",
      objective: "Expand AVOS enterprise capabilities safely",
      priority: 96,
      confidence: 95,
      constraints: ["security-first", "rollback-readiness"],
      context: { market: "dynamic", architecture: "modular" }
    },
    {
      key: "continuous-optimization",
      objective: "Continuously optimize enterprise reality",
      priority: 93,
      confidence: 94,
      constraints: ["auditability"],
      context: { operations: "autonomous", governance: "constitutional" }
    }
  ],
  constitutionalPrinciples: [
    {
      key: "security-first",
      authority: 100,
      mandatory: true,
      domain: "security",
      controls: ["continuous-security-monitoring"]
    },
    {
      key: "human-sovereignty",
      authority: 98,
      mandatory: true,
      domain: "governance",
      controls: ["human-oversight"]
    },
    {
      key: "automatic-recovery",
      authority: 94,
      mandatory: false,
      domain: "operations",
      controls: ["automatic-rollback"]
    }
  ],
  optimizationDomains: [
    {
      key: "operations",
      currentScore: 90,
      targetScore: 97,
      effort: 25,
      impact: 95
    },
    {
      key: "governance",
      currentScore: 92,
      targetScore: 98,
      effort: 20,
      impact: 96
    },
    {
      key: "knowledge",
      currentScore: 89,
      targetScore: 97,
      effort: 28,
      impact: 94
    }
  ],
  knowledgeEntries: [
    {
      key: "apex-runtime-v14",
      source: "ultra-mega-pack-q",
      payload: { version: "100.0.0", status: "verified" },
      replicas: 5
    },
    {
      key: "zenith-runtime-v15",
      source: "ultra-mega-pack-r",
      payload: { version: "105.0.0", status: "active" },
      replicas: 5
    }
  ],
  zenithRuntimes: [
    {
      key: "intent-runtime",
      layer: "intent",
      readiness: 98,
      autonomy: 95
    },
    {
      key: "constitution-runtime",
      layer: "constitution",
      readiness: 99,
      autonomy: 93
    },
    {
      key: "optimization-runtime",
      layer: "optimization",
      readiness: 97,
      autonomy: 94
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
      readiness: 98,
      autonomy: 96
    }
  ]
});

const health = new UltraMegaPackRRuntimeVerifier().verify(result);

if (!health.healthy) {
  console.error(JSON.stringify({ result, health }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  success: true,
  system: "AVOS CodeGen OS",
  bundle: "Ultra Mega Pack R",
  packs: "101-105",
  status: result.status,
  score: result.score,
  intentScore: health.intentScore,
  normalizedIntents: health.normalizedIntents,
  constitutionSynthesized: health.constitutionSynthesized,
  constitutionScore: health.constitutionScore,
  optimizationScore: health.optimizationScore,
  optimizationActions: health.optimizationActions,
  knowledgeRecords: health.knowledgeRecords,
  knowledgeGeneration: health.knowledgeGeneration,
  knowledgeContinuityVerified: health.knowledgeContinuityVerified,
  knowledgeReplicaScore: health.knowledgeReplicaScore,
  zenithActive: health.zenithActive,
  zenithReadiness: health.zenithReadiness,
  zenithAutonomy: health.zenithAutonomy,
  healthStatus: "healthy"
}, null, 2));
'@ | Set-Content -Path $SmokeFile -Encoding UTF8

try {
    node $SmokeFile
    if ($LASTEXITCODE -ne 0) {
        throw "Ultra Mega Pack R smoke test failed."
    }
}
finally {
    Remove-Item $SmokeFile -Force -ErrorAction SilentlyContinue
}

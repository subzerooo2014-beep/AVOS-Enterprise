$ErrorActionPreference = "Stop"
$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root
$SmokeFile = Join-Path $env:TEMP "avos-ultra-mega-pack-o-smoke.cjs"

@'
const {
  EnterpriseOmniOrchestratorV12,
  UltraMegaPackORuntimeVerifier,
} = require(process.cwd() + "/dist/ultra-mega-pack-o");

const orchestrator = new EnterpriseOmniOrchestratorV12();

const result = orchestrator.execute({
  systemKey: "avos-enterprise",
  realityEntities: [
    { key: "operations", domain: "operations", stateScore: 97, confidence: 96, attributes: {} },
    { key: "finance", domain: "finance", stateScore: 95, confidence: 94, attributes: {} },
    { key: "ai", domain: "ai", stateScore: 96, confidence: 97, attributes: {} },
    { key: "governance", domain: "governance", stateScore: 98, confidence: 98, attributes: {} }
  ],
  treatyParties: [
    { key: "enterprise-brain", authority: 96, trust: 97, obligations: ["security", "auditability"] },
    { key: "control-plane", authority: 98, trust: 98, obligations: ["governance", "rollback"] },
    { key: "genesis-engine", authority: 94, trust: 95, obligations: ["generation", "resilience"] }
  ],
  treatyProposal: {
    key: "enterprise-omni-treaty",
    requiredObligations: ["security", "auditability", "governance", "rollback", "generation", "resilience"],
    minimumAuthority: 90,
    minimumTrust: 90
  },
  civilizationObjectives: [
    { key: "near-term-autonomy", horizon: "near", impact: 94, readiness: 95, resilience: 93, dependencies: [] },
    { key: "mid-term-expansion", horizon: "mid", impact: 96, readiness: 91, resilience: 94, dependencies: ["near-term-autonomy"] },
    { key: "long-term-civilization", horizon: "long", impact: 99, readiness: 88, resilience: 97, dependencies: ["mid-term-expansion"] }
  ],
  knowledgeEntries: [
    { key: "governance-nexus-v11", payload: { version: "85.0.0", status: "verified" } },
    { key: "omni-coordination-v12", payload: { version: "90.0.0", status: "active" } }
  ],
  omniRuntimes: [
    { key: "reality-runtime", layer: "reality", readiness: 97, authority: 96 },
    { key: "treaty-runtime", layer: "treaty", readiness: 96, authority: 97 },
    { key: "planning-runtime", layer: "planning", readiness: 95, authority: 94 },
    { key: "knowledge-runtime", layer: "knowledge", readiness: 98, authority: 96 },
    { key: "governance-runtime", layer: "governance", readiness: 98, authority: 99 },
    { key: "operations-runtime", layer: "operations", readiness: 97, authority: 95 }
  ]
});

const health = new UltraMegaPackORuntimeVerifier().verify(result);
if (!health.healthy) {
  console.error(JSON.stringify({ result, health }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  success: true,
  system: "AVOS CodeGen OS",
  bundle: "Ultra Mega Pack O",
  packs: "86-90",
  status: result.status,
  score: result.score,
  realityScore: health.realityScore,
  realityEntities: health.realityEntities,
  treatyRatified: health.treatyRatified,
  treatyScore: health.treatyScore,
  civilizationPlanScore: health.civilizationPlanScore,
  civilizationPlanItems: health.civilizationPlanItems,
  knowledgeRecords: health.knowledgeRecords,
  knowledgeGeneration: health.knowledgeGeneration,
  knowledgeContinuityVerified: health.knowledgeContinuityVerified,
  omniActive: health.omniActive,
  omniReadiness: health.omniReadiness,
  omniAuthority: health.omniAuthority,
  healthStatus: "healthy"
}, null, 2));
'@ | Set-Content -Path $SmokeFile -Encoding UTF8

try {
    node $SmokeFile
    if ($LASTEXITCODE -ne 0) { throw "Ultra Mega Pack O smoke test failed." }
}
finally {
    Remove-Item $SmokeFile -Force -ErrorAction SilentlyContinue
}

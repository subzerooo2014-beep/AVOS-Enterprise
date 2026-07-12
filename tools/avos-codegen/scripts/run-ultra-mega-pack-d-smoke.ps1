$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$SmokeFile = Join-Path $env:TEMP "avos-ultra-mega-pack-d-smoke.cjs"

@'
const {
  AvosDigitalConstitution,
  ConstitutionRuleEffect,
  EnterpriseDecisionGraph,
  UltraMegaPackDOrchestrator,
  UltraMegaPackDRuntimeVerifier,
} = require(process.cwd() + "/dist/ultra-mega-pack-d");

const constitution = new AvosDigitalConstitution();
constitution.register({
  key: "security-first",
  principle: "Security and auditability are mandatory.",
  effect: ConstitutionRuleEffect.REQUIRE_CONTROL,
  priority: 100,
  requiredFacts: ["securityReviewed"],
  controls: ["security-review", "audit-evidence"],
});

const graph = new EnterpriseDecisionGraph();
graph.addNode({
  key: "market-signal",
  kind: "fact",
  label: "Market signal",
  weight: 80,
  metadata: {},
});
graph.addNode({
  key: "launch-decision",
  kind: "decision",
  label: "Launch decision",
  weight: 90,
  metadata: {},
});
graph.connect({
  source: "market-signal",
  target: "launch-decision",
  relation: "supports",
  confidence: 92,
});

const orchestrator = new UltraMegaPackDOrchestrator(
  constitution,
  graph,
);

const result = orchestrator.execute({
  systemKey: "avos-enterprise",
  constitution: {
    systemKey: "avos-enterprise",
    action: "launch-generated-enterprise-system",
    facts: { securityReviewed: true },
  },
  decisionKey: "launch-decision",
  objectives: [
    {
      key: "safe-growth",
      description: "Grow safely with governed automation.",
      priority: 90,
      targetScore: 90,
      dependencies: [],
    },
  ],
  scenarios: [
    {
      key: "demand-spike",
      probability: 70,
      impact: 60,
      assumptions: {},
    },
  ],
  resilienceComponents: [
    {
      key: "generation-runtime",
      criticality: 8,
      redundancy: 3,
      recoveryMinutes: 10,
      dependencyCount: 2,
    },
  ],
  resilienceExperiments: [
    {
      key: "generation-runtime-failure",
      failedComponents: ["generation-runtime"],
      durationMinutes: 5,
      trafficPercent: 20,
    },
  ],
  standardRequirements: [
    {
      key: "secure-development",
      standard: "AVOS Enterprise Baseline",
      domain: "security",
      mandatory: true,
      controls: ["security-review"],
    },
  ],
  implementedControls: [
    {
      key: "security-review",
      domains: ["security"],
      evidenceAvailable: true,
      maturity: 90,
    },
  ],
});

const health = new UltraMegaPackDRuntimeVerifier().verify(result);

if (!health.healthy) {
  console.error(JSON.stringify({ result, health }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  success: true,
  system: "AVOS CodeGen OS",
  bundle: "Ultra Mega Pack D",
  packs: "31-35",
  decision: result.decision,
  score: result.score,
  constitutionCompliant: health.constitutionCompliant,
  strategicScore: health.strategicScore,
  resilienceScore: health.resilienceScore,
  standardsCoverage: health.standardsCoverage,
  decisionConfidence: health.decisionConfidence,
  healthStatus: "healthy",
}, null, 2));
'@ | Set-Content -Path $SmokeFile -Encoding UTF8

try {
    node $SmokeFile
    if ($LASTEXITCODE -ne 0) {
        throw "Ultra Mega Pack D smoke test failed."
    }
}
finally {
    Remove-Item $SmokeFile -Force -ErrorAction SilentlyContinue
}

$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$SmokeFile = Join-Path $env:TEMP "avos-ultra-mega-pack-j-smoke.cjs"

@'
const {
  EnterpriseIntelligenceOrchestratorV7,
  UltraMegaPackJRuntimeVerifier,
} = require(process.cwd() + "/dist/ultra-mega-pack-j");

const orchestrator = new EnterpriseIntelligenceOrchestratorV7();

const result = orchestrator.execute({
  systemKey: "avos-enterprise",
  goals: [
    {
      key: "autonomous-enterprise-growth",
      objective: "Continuously grow enterprise capabilities safely.",
      priority: 96,
      context: {
        market: "dynamic",
        architecture: "modular",
        governance: "constitutional"
      },
      constraints: [
        "security-first",
        "auditability",
        "rollback-readiness"
      ]
    },
    {
      key: "cross-domain-intelligence",
      objective: "Federate intelligence across enterprise domains.",
      priority: 92,
      context: {
        domains: 5,
        federation: "enabled"
      },
      constraints: ["privacy", "explainability"]
    }
  ],
  decisionNodes: [
    {
      key: "architecture-node",
      domain: "architecture",
      authority: 95,
      reliability: 94,
      recommendation: "approve"
    },
    {
      key: "security-node",
      domain: "security",
      authority: 98,
      reliability: 96,
      recommendation: "approve_with_controls"
    },
    {
      key: "operations-node",
      domain: "operations",
      authority: 92,
      reliability: 93,
      recommendation: "approve"
    }
  ],
  architectureCapabilities: [
    {
      key: "enterprise-intelligence",
      type: "agent",
      criticality: 9,
      expectedLoad: 80
    },
    {
      key: "global-decision-routing",
      type: "workflow",
      criticality: 9,
      expectedLoad: 70
    },
    {
      key: "knowledge-federation",
      type: "data",
      criticality: 8,
      expectedLoad: 75
    },
    {
      key: "evolution-governance",
      type: "policy",
      criticality: 10,
      expectedLoad: 50
    }
  ],
  knowledgeNodes: [
    {
      key: "architecture-knowledge",
      domain: "architecture",
      confidence: 96,
      concepts: ["enterprise", "modularity", "governance"],
      payload: {}
    },
    {
      key: "operations-knowledge",
      domain: "operations",
      confidence: 94,
      concepts: ["enterprise", "resilience", "governance"],
      payload: {}
    },
    {
      key: "ai-knowledge",
      domain: "ai",
      confidence: 95,
      concepts: ["enterprise", "intelligence", "governance"],
      payload: {}
    }
  ],
  evolutionSignals: [
    {
      key: "architecture-maturity",
      domain: "architecture",
      currentMaturity: 91,
      targetMaturity: 96,
      autonomy: 92
    },
    {
      key: "operations-maturity",
      domain: "operations",
      currentMaturity: 90,
      targetMaturity: 95,
      autonomy: 94
    },
    {
      key: "knowledge-maturity",
      domain: "knowledge",
      currentMaturity: 89,
      targetMaturity: 96,
      autonomy: 91
    },
    {
      key: "intelligence-maturity",
      domain: "intelligence",
      currentMaturity: 92,
      targetMaturity: 97,
      autonomy: 95
    },
    {
      key: "governance-maturity",
      domain: "governance",
      currentMaturity: 94,
      targetMaturity: 98,
      autonomy: 93
    }
  ]
});

const health = new UltraMegaPackJRuntimeVerifier().verify(result);

if (!health.healthy) {
  console.error(JSON.stringify({ result, health }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  success: true,
  system: "AVOS CodeGen OS",
  bundle: "Ultra Mega Pack J",
  packs: "61-65",
  status: result.status,
  score: result.score,
  intelligenceScore: health.intelligenceScore,
  insights: health.insights,
  decision: health.decision,
  decisionConsensus: health.decisionConsensus,
  architectureScore: health.architectureScore,
  architectureComponents: health.architectureComponents,
  knowledgeNodes: health.knowledgeNodes,
  knowledgeLinks: health.knowledgeLinks,
  federationScore: health.federationScore,
  maturityScore: health.maturityScore,
  autonomyScore: health.autonomyScore,
  evolutionActions: health.evolutionActions,
  healthStatus: "healthy"
}, null, 2));
'@ | Set-Content -Path $SmokeFile -Encoding UTF8

try {
    node $SmokeFile
    if ($LASTEXITCODE -ne 0) {
        throw "Ultra Mega Pack J smoke test failed."
    }
}
finally {
    Remove-Item $SmokeFile -Force -ErrorAction SilentlyContinue
}

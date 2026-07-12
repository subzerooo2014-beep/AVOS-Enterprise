$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$SmokeFile = Join-Path $env:TEMP "avos-ultra-mega-pack-k-smoke.cjs"

@'
const {
  EnterpriseCivilizationOrchestratorV8,
  UltraMegaPackKRuntimeVerifier,
} = require(process.cwd() + "/dist/ultra-mega-pack-k");

const orchestrator = new EnterpriseCivilizationOrchestratorV8();

const result = orchestrator.execute({
  systemKey: "avos-enterprise",
  economicInitiatives: [
    {
      key: "autonomous-sales-optimization",
      investment: 100000,
      expectedRevenue: 320000,
      operatingCost: 60000,
      riskPercent: 18,
      strategicValue: 95
    },
    {
      key: "predictive-service-platform",
      investment: 80000,
      expectedRevenue: 220000,
      operatingCost: 45000,
      riskPercent: 20,
      strategicValue: 90
    }
  ],
  capabilities: [
    {
      key: "enterprise-ai-reasoning",
      provider: "enterprise-brain",
      category: "reasoning",
      version: "1.0.0",
      reliability: 96,
      capacity: 100,
      tags: ["ai", "enterprise", "governance"],
      metadata: {}
    },
    {
      key: "global-workflow-orchestration",
      provider: "genesis-engine",
      category: "orchestration",
      version: "1.0.0",
      reliability: 95,
      capacity: 90,
      tags: ["workflow", "enterprise", "automation"],
      metadata: {}
    }
  ],
  capabilityRequests: [
    {
      key: "strategic-reasoning-request",
      requiredCategory: "reasoning",
      requiredTags: ["ai", "enterprise"],
      minimumReliability: 90,
      workload: 40
    },
    {
      key: "workflow-orchestration-request",
      requiredCategory: "orchestration",
      requiredTags: ["workflow", "automation"],
      minimumReliability: 90,
      workload: 35
    }
  ],
  availableBudget: 180000,
  fundingCandidates: [
    {
      key: "autonomous-sales-optimization",
      requestedBudget: 100000,
      expectedReturn: 320000,
      paybackMonths: 8,
      strategicPriority: 95,
      riskPercent: 18
    },
    {
      key: "predictive-service-platform",
      requestedBudget: 80000,
      expectedReturn: 220000,
      paybackMonths: 10,
      strategicPriority: 90,
      riskPercent: 20
    }
  ],
  innovationNodes: [
    {
      key: "mena-ai-node",
      region: "mena",
      domain: "ai",
      expertise: ["automation", "reasoning", "market-intelligence"],
      reliability: 95
    },
    {
      key: "europe-ai-node",
      region: "europe",
      domain: "ai",
      expertise: ["automation", "governance", "platform-design"],
      reliability: 93
    },
    {
      key: "asia-ai-node",
      region: "asia",
      domain: "ai",
      expertise: ["reasoning", "optimization", "platform-design"],
      reliability: 94
    }
  ],
  innovationOpportunities: [
    {
      key: "adaptive-enterprise-marketplace",
      domain: "ai",
      requiredExpertise: ["automation", "reasoning"],
      marketImpact: 96,
      implementationReadiness: 90,
      complexity: 35
    },
    {
      key: "autonomous-enterprise-advisor",
      domain: "ai",
      requiredExpertise: ["reasoning", "platform-design"],
      marketImpact: 94,
      implementationReadiness: 88,
      complexity: 30
    }
  ],
  civilizationEngines: [
    {
      key: "enterprise-economy-engine",
      domain: "economy",
      readiness: 94,
      autonomy: 91,
      dependencies: []
    },
    {
      key: "capability-exchange-engine",
      domain: "capabilities",
      readiness: 95,
      autonomy: 92,
      dependencies: ["enterprise-economy-engine"]
    },
    {
      key: "self-funding-engine",
      domain: "funding",
      readiness: 93,
      autonomy: 90,
      dependencies: ["enterprise-economy-engine"]
    },
    {
      key: "innovation-network-engine",
      domain: "innovation",
      readiness: 94,
      autonomy: 91,
      dependencies: ["capability-exchange-engine"]
    },
    {
      key: "constitutional-governance-engine",
      domain: "governance",
      readiness: 96,
      autonomy: 89,
      dependencies: []
    },
    {
      key: "autonomous-operations-engine",
      domain: "operations",
      readiness: 95,
      autonomy: 94,
      dependencies: []
    }
  ]
});

const health = new UltraMegaPackKRuntimeVerifier().verify(result);

if (!health.healthy) {
  console.error(JSON.stringify({ result, health }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  success: true,
  system: "AVOS CodeGen OS",
  bundle: "Ultra Mega Pack K",
  packs: "66-70",
  status: result.status,
  score: result.score,
  portfolioValue: health.portfolioValue,
  portfolioScore: health.portfolioScore,
  viableInitiatives: health.viableInitiatives,
  capabilityMatches: health.capabilityMatches,
  unmatchedCapabilityRequests: health.unmatchedCapabilityRequests,
  fundingAllocations: health.fundingAllocations,
  selfFundingRatio: health.selfFundingRatio,
  innovationProposals: health.innovationProposals,
  unmatchedInnovationOpportunities: health.unmatchedInnovationOpportunities,
  civilizationActive: health.civilizationActive,
  civilizationReadiness: health.civilizationReadiness,
  civilizationAutonomy: health.civilizationAutonomy,
  healthStatus: "healthy"
}, null, 2));
'@ | Set-Content -Path $SmokeFile -Encoding UTF8

try {
    node $SmokeFile
    if ($LASTEXITCODE -ne 0) {
        throw "Ultra Mega Pack K smoke test failed."
    }
}
finally {
    Remove-Item $SmokeFile -Force -ErrorAction SilentlyContinue
}

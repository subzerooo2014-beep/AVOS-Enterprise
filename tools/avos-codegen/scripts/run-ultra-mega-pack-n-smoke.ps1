$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$SmokeFile = Join-Path $env:TEMP "avos-ultra-mega-pack-n-smoke.cjs"

@'
const {
  EnterpriseGovernanceOrchestratorV11,
  UltraMegaPackNRuntimeVerifier,
} = require(process.cwd() + "/dist/ultra-mega-pack-n");

const orchestrator = new EnterpriseGovernanceOrchestratorV11();

const result = orchestrator.execute({
  systemKey: "avos-enterprise",
  identityClaims: [
    {
      key: "identity-claim-codegen",
      issuer: "avos-digital-constitution",
      subject: "avos-enterprise",
      confidence: 98,
      attributes: {
        layer: "codegen",
        status: "verified"
      }
    },
    {
      key: "identity-claim-governance",
      issuer: "meta-governance-runtime",
      subject: "avos-enterprise",
      confidence: 97,
      attributes: {
        layer: "governance",
        status: "verified"
      }
    }
  ],
  allianceMembers: [
    {
      key: "enterprise-brain-alliance",
      domain: "ai",
      trustScore: 97,
      capabilityScore: 96,
      governanceScore: 95,
      strategicAlignment: 94
    },
    {
      key: "genesis-engine-alliance",
      domain: "generation",
      trustScore: 96,
      capabilityScore: 95,
      governanceScore: 94,
      strategicAlignment: 93
    },
    {
      key: "control-plane-alliance",
      domain: "governance",
      trustScore: 98,
      capabilityScore: 94,
      governanceScore: 97,
      strategicAlignment: 95
    }
  ],
  capitalDomains: [
    {
      key: "enterprise-growth-capital",
      availableCapital: 2000000,
      reserveRequirement: 700000,
      expectedReturnPercent: 26,
      civilizationPriority: 96,
      riskPercent: 14
    },
    {
      key: "innovation-capital",
      availableCapital: 1000000,
      reserveRequirement: 300000,
      expectedReturnPercent: 22,
      civilizationPriority: 93,
      riskPercent: 12
    }
  ],
  knowledgeEntries: [
    {
      key: "supreme-coordination-v10",
      payload: {
        version: "80.0.0",
        status: "verified"
      }
    },
    {
      key: "governance-nexus-v11",
      payload: {
        version: "85.0.0",
        status: "active"
      }
    }
  ],
  nexusRuntimes: [
    {
      key: "universal-identity-runtime",
      domain: "identity",
      readiness: 98,
      authority: 97
    },
    {
      key: "alliance-network-runtime",
      domain: "alliances",
      readiness: 96,
      authority: 94
    },
    {
      key: "capital-civilization-runtime",
      domain: "capital",
      readiness: 95,
      authority: 93
    },
    {
      key: "knowledge-continuity-runtime",
      domain: "knowledge",
      readiness: 98,
      authority: 96
    },
    {
      key: "meta-governance-runtime",
      domain: "governance",
      readiness: 97,
      authority: 99
    },
    {
      key: "autonomous-operations-runtime",
      domain: "operations",
      readiness: 96,
      authority: 94
    }
  ]
});

const health = new UltraMegaPackNRuntimeVerifier().verify(result);

if (!health.healthy) {
  console.error(JSON.stringify({ result, health }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  success: true,
  system: "AVOS CodeGen OS",
  bundle: "Ultra Mega Pack N",
  packs: "81-85",
  status: result.status,
  score: result.score,
  identityVerified: health.identityVerified,
  identityConfidence: health.identityConfidence,
  identityClaims: health.identityClaims,
  identityIssuers: health.identityIssuers,
  allianceScore: health.allianceScore,
  allianceConnections: health.allianceConnections,
  trustedAllianceConnections: health.trustedAllianceConnections,
  untrustedAllianceConnections: health.untrustedAllianceConnections,
  totalDeployableCapital: health.totalDeployableCapital,
  projectedReturn: health.projectedReturn,
  capitalScore: health.capitalScore,
  knowledgeRecords: health.knowledgeRecords,
  knowledgeGeneration: health.knowledgeGeneration,
  knowledgeContinuityVerified: health.knowledgeContinuityVerified,
  nexusActive: health.nexusActive,
  nexusReadiness: health.nexusReadiness,
  nexusAuthority: health.nexusAuthority,
  healthStatus: "healthy"
}, null, 2));
'@ | Set-Content -Path $SmokeFile -Encoding UTF8

try {
    node $SmokeFile
    if ($LASTEXITCODE -ne 0) {
        throw "Ultra Mega Pack N smoke test failed."
    }
}
finally {
    Remove-Item $SmokeFile -Force -ErrorAction SilentlyContinue
}

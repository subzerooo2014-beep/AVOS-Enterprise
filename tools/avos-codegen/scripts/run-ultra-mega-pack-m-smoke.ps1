$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$SmokeFile = Join-Path $env:TEMP "avos-ultra-mega-pack-m-smoke.cjs"

@'
const {
  EnterpriseSupremeOrchestratorV10,
  UltraMegaPackMRuntimeVerifier,
} = require(process.cwd() + "/dist/ultra-mega-pack-m");

const orchestrator = new EnterpriseSupremeOrchestratorV10();

const result = orchestrator.execute({
  systemKey: "avos-enterprise",
  autonomyRequest: {
    domain: "ai",
    requestedAutonomy: 88,
    oversightLevel: 82,
    controls: [
      "constitutional-evaluation",
      "continuous-observability",
      "automatic-rollback"
    ]
  },
  autonomyClauses: [
    {
      key: "enterprise-ai-autonomy-boundary",
      domain: "ai",
      maximumAutonomy: 90,
      minimumOversight: 75,
      mandatory: true,
      requiredControls: [
        "constitutional-evaluation",
        "continuous-observability",
        "automatic-rollback"
      ]
    }
  ],
  trustNodes: [
    {
      key: "enterprise-brain",
      domain: "ai",
      directTrust: 97,
      evidenceTrust: 96,
      relationshipTrust: 94,
      peers: ["genesis-engine", "control-plane"]
    },
    {
      key: "genesis-engine",
      domain: "generation",
      directTrust: 96,
      evidenceTrust: 95,
      relationshipTrust: 93,
      peers: ["enterprise-brain", "control-plane"]
    },
    {
      key: "control-plane",
      domain: "governance",
      directTrust: 98,
      evidenceTrust: 97,
      relationshipTrust: 96,
      peers: ["enterprise-brain", "genesis-engine"]
    }
  ],
  treasuryAccounts: [
    {
      key: "enterprise-treasury",
      balance: 1500000,
      minimumReserve: 500000,
      expectedOutflow: 250000,
      expectedInflow: 400000,
      riskPercent: 10
    },
    {
      key: "innovation-treasury",
      balance: 500000,
      minimumReserve: 150000,
      expectedOutflow: 80000,
      expectedInflow: 120000,
      riskPercent: 12
    }
  ],
  treasuryTargets: [
    {
      key: "autonomous-marketplace-expansion",
      requestedCapital: 500000,
      expectedYieldPercent: 28,
      strategicPriority: 96,
      liquidityClass: "medium"
    },
    {
      key: "enterprise-ai-research",
      requestedCapital: 300000,
      expectedYieldPercent: 22,
      strategicPriority: 92,
      liquidityClass: "high"
    }
  ],
  archiveEntries: [
    {
      key: "meta-governance-generation",
      payload: {
        version: "75.0.0",
        status: "verified"
      }
    },
    {
      key: "supreme-coordination-generation",
      payload: {
        version: "80.0.0",
        status: "active"
      }
    }
  ],
  supremeRuntimes: [
    {
      key: "autonomy-constitution-runtime",
      layer: "constitution",
      readiness: 97,
      autonomy: 92,
      dependencies: []
    },
    {
      key: "global-trust-fabric-runtime",
      layer: "trust",
      readiness: 96,
      autonomy: 93,
      dependencies: ["autonomy-constitution-runtime"]
    },
    {
      key: "treasury-intelligence-runtime",
      layer: "treasury",
      readiness: 95,
      autonomy: 90,
      dependencies: ["global-trust-fabric-runtime"]
    },
    {
      key: "evolution-archive-runtime",
      layer: "archive",
      readiness: 98,
      autonomy: 88,
      dependencies: []
    },
    {
      key: "meta-governance-runtime",
      layer: "governance",
      readiness: 97,
      autonomy: 91,
      dependencies: ["autonomy-constitution-runtime"]
    },
    {
      key: "autonomous-operations-runtime",
      layer: "operations",
      readiness: 96,
      autonomy: 94,
      dependencies: []
    }
  ]
});

const health = new UltraMegaPackMRuntimeVerifier().verify(result);

if (!health.healthy) {
  console.error(JSON.stringify({ result, health }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  success: true,
  system: "AVOS CodeGen OS",
  bundle: "Ultra Mega Pack M",
  packs: "76-80",
  status: result.status,
  score: result.score,
  autonomyApproved: health.autonomyApproved,
  autonomyScore: health.autonomyScore,
  fabricTrustScore: health.fabricTrustScore,
  trustedNodes: health.trustedNodes,
  untrustedNodes: health.untrustedNodes,
  availableLiquidity: health.availableLiquidity,
  treasuryAllocations: health.treasuryAllocations,
  projectedYield: health.projectedYield,
  liquidityScore: health.liquidityScore,
  archiveRecords: health.archiveRecords,
  archiveGeneration: health.archiveGeneration,
  archiveLineageVerified: health.archiveLineageVerified,
  supremeCoordinated: health.supremeCoordinated,
  supremeReadiness: health.supremeReadiness,
  supremeAutonomy: health.supremeAutonomy,
  healthStatus: "healthy"
}, null, 2));
'@ | Set-Content -Path $SmokeFile -Encoding UTF8

try {
    node $SmokeFile
    if ($LASTEXITCODE -ne 0) {
        throw "Ultra Mega Pack M smoke test failed."
    }
}
finally {
    Remove-Item $SmokeFile -Force -ErrorAction SilentlyContinue
}

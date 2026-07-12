$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$SmokeFile = Join-Path $env:TEMP "avos-ultra-mega-pack-l-smoke.cjs"

@'
const {
  EnterpriseMetaGovernanceOrchestratorV9,
  UltraMegaPackLRuntimeVerifier,
} = require(process.cwd() + "/dist/ultra-mega-pack-l");

const orchestrator = new EnterpriseMetaGovernanceOrchestratorV9();

const result = orchestrator.execute({
  systemKey: "avos-enterprise",
  sovereigntyRequest: {
    systemKey: "avos-enterprise",
    action: "execute-enterprise-value-exchange",
    domain: "finance",
    region: "UAE",
    controls: [
      "audit-ledger",
      "data-residency",
      "financial-approval"
    ]
  },
  sovereigntyRules: [
    {
      key: "uae-financial-sovereignty",
      domain: "finance",
      mandatory: true,
      authority: 100,
      allowedRegions: ["UAE"],
      requiredControls: [
        "audit-ledger",
        "data-residency",
        "financial-approval"
      ]
    }
  ],
  trustNodes: [
    {
      key: "enterprise-brain",
      domain: "ai",
      identityScore: 98,
      behaviorScore: 95,
      evidenceScore: 97,
      incidents: 0
    },
    {
      key: "genesis-engine",
      domain: "generation",
      identityScore: 97,
      behaviorScore: 94,
      evidenceScore: 96,
      incidents: 0
    },
    {
      key: "control-plane",
      domain: "governance",
      identityScore: 99,
      behaviorScore: 96,
      evidenceScore: 98,
      incidents: 0
    }
  ],
  valueAccounts: [
    {
      key: "enterprise-treasury",
      currency: "AED",
      balance: 1000000,
      trustScore: 98,
      dailyLimit: 500000
    },
    {
      key: "innovation-fund",
      currency: "AED",
      balance: 100000,
      trustScore: 95,
      dailyLimit: 300000
    }
  ],
  valueTransfers: [
    {
      key: "fund-innovation-network",
      from: "enterprise-treasury",
      to: "innovation-fund",
      amount: 250000,
      currency: "AED",
      priority: 95
    }
  ],
  archiveEntries: [
    {
      key: "digital-constitution-v1",
      category: "governance",
      payload: {
        status: "active",
        principles: 12
      }
    },
    {
      key: "civilization-runtime-v1",
      category: "architecture",
      payload: {
        status: "active",
        engines: 6
      }
    }
  ],
  constitutions: [
    {
      key: "avos-digital-constitution",
      authority: 100,
      mandatory: true,
      principles: [
        "security-first",
        "auditability",
        "human-sovereignty"
      ],
      controls: [
        "constitutional-evaluation",
        "evidence-chain"
      ]
    },
    {
      key: "enterprise-governance-charter",
      authority: 95,
      mandatory: true,
      principles: [
        "resilience",
        "financial-accountability",
        "explainability"
      ],
      controls: [
        "executive-oversight",
        "automatic-rollback"
      ]
    }
  ]
});

const health = new UltraMegaPackLRuntimeVerifier().verify(result);

if (!health.healthy) {
  console.error(JSON.stringify({ result, health }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  success: true,
  system: "AVOS CodeGen OS",
  bundle: "Ultra Mega Pack L",
  packs: "71-75",
  status: result.status,
  score: result.score,
  sovereigntyAllowed: health.sovereigntyAllowed,
  sovereigntyScore: health.sovereigntyScore,
  networkTrustScore: health.networkTrustScore,
  trustedNodes: health.trustedNodes,
  untrustedNodes: health.untrustedNodes,
  settledTransfers: health.settledTransfers,
  rejectedTransfers: health.rejectedTransfers,
  totalSettledValue: health.totalSettledValue,
  archiveRecords: health.archiveRecords,
  archiveGenerations: health.archiveGenerations,
  archiveIntegrityVerified: health.archiveIntegrityVerified,
  metaGovernanceApproved: health.metaGovernanceApproved,
  metaGovernanceScore: health.metaGovernanceScore,
  healthStatus: "healthy"
}, null, 2));
'@ | Set-Content -Path $SmokeFile -Encoding UTF8

try {
    node $SmokeFile
    if ($LASTEXITCODE -ne 0) {
        throw "Ultra Mega Pack L smoke test failed."
    }
}
finally {
    Remove-Item $SmokeFile -Force -ErrorAction SilentlyContinue
}

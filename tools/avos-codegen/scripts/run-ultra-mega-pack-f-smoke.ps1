$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$SmokeFile = Join-Path $env:TEMP "avos-ultra-mega-pack-f-smoke.cjs"

@'
const {
  EnterpriseGenerationOrchestratorV3,
  UltraMegaPackFRuntimeVerifier,
} = require(process.cwd() + "/dist/ultra-mega-pack-f");

const orchestrator = new EnterpriseGenerationOrchestratorV3();

const result = orchestrator.execute({
  systemKey: "avos-enterprise",
  goals: [
    {
      key: "autonomous-dealer-operations",
      description: "Generate autonomous dealer operations.",
      priority: 95,
      constraints: ["security-first", "auditability", "modularity"],
      successMetrics: {
        automationCoverage: 90,
        operationalAccuracy: 95
      }
    },
    {
      key: "adaptive-customer-intelligence",
      description: "Generate adaptive customer intelligence capabilities.",
      priority: 88,
      constraints: ["privacy", "explainability"],
      successMetrics: {
        recommendationQuality: 90
      }
    }
  ],
  evolutionSignals: [
    {
      key: "generation-performance",
      category: "performance",
      current: 82,
      target: 95,
      weight: 2
    },
    {
      key: "security-posture",
      category: "security",
      current: 90,
      target: 95,
      weight: 3
    }
  ],
  validationNodes: [
    {
      key: "typescript-build",
      category: "build",
      required: true,
      score: 100
    },
    {
      key: "architecture-validation",
      category: "architecture",
      required: true,
      score: 94
    },
    {
      key: "security-validation",
      category: "security",
      required: true,
      score: 92
    },
    {
      key: "compliance-validation",
      category: "compliance",
      required: true,
      score: 90
    }
  ],
  requiredCapabilities: [
    "modular-generation",
    "event-driven-runtime",
    "security-governance"
  ],
  blueprintCandidates: [
    {
      key: "enterprise-autonomy-blueprint",
      version: "2.0.0",
      capabilities: [
        "modular-generation",
        "event-driven-runtime",
        "security-governance"
      ],
      compatibilityScore: 96,
      qualityScore: 93,
      securityScore: 95,
      adoptionScore: 85
    },
    {
      key: "generic-platform-blueprint",
      version: "1.5.0",
      capabilities: ["modular-generation"],
      compatibilityScore: 80,
      qualityScore: 84,
      securityScore: 82,
      adoptionScore: 90
    }
  ],
  releaseCandidate: {
    systemKey: "avos-enterprise",
    version: "45.0.0",
    validationScore: 94,
    securityScore: 95,
    architectureScore: 96,
    rollbackReady: true,
    changeRisk: 45
  }
});

const health = new UltraMegaPackFRuntimeVerifier().verify(result);

if (!health.healthy) {
  console.error(JSON.stringify({ result, health }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  success: true,
  system: "AVOS CodeGen OS",
  bundle: "Ultra Mega Pack F",
  packs: "41-45",
  status: result.status,
  score: result.score,
  generatedModules: health.generatedModules,
  evolutionHealth: health.evolutionHealth,
  evolutionActions: health.evolutionActions,
  validationScore: health.validationScore,
  validationPassed: health.validationPassed,
  topBlueprintScore: health.topBlueprintScore,
  releaseApproved: health.releaseApproved,
  releaseStrategy: health.releaseStrategy,
  healthStatus: "healthy"
}, null, 2));
'@ | Set-Content -Path $SmokeFile -Encoding UTF8

try {
    node $SmokeFile
    if ($LASTEXITCODE -ne 0) {
        throw "Ultra Mega Pack F smoke test failed."
    }
}
finally {
    Remove-Item $SmokeFile -Force -ErrorAction SilentlyContinue
}

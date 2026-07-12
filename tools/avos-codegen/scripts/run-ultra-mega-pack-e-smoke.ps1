$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

$SmokeFile = Join-Path $env:TEMP "avos-ultra-mega-pack-e-smoke.cjs"

@'
const {
  EnterpriseEvolutionOrchestratorV2,
  UltraMegaPackERuntimeVerifier,
} = require(process.cwd() + "/dist/ultra-mega-pack-e");

const orchestrator = new EnterpriseEvolutionOrchestratorV2();

const result = orchestrator.execute({
  systemKey: "avos-enterprise",
  knowledgeAssets: [
    {
      key: "secure-code-generation",
      title: "Secure Code Generation",
      domain: "codegen",
      confidence: 94,
      tags: ["security", "codegen", "governance"],
      content: {
        principle: "Generate secure and auditable systems by default."
      },
      sourceSystems: ["codegen-os", "enterprise-brain"]
    }
  ],
  knowledgeLessons: [
    {
      key: "lesson-secure-code-generation",
      assetKey: "secure-code-generation",
      objective: "Apply secure generation standards.",
      prerequisites: [],
      assessmentQuestions: 5
    }
  ],
  synchronizationTargets: [
    "enterprise-brain",
    "genesis-engine",
    "blueprint-marketplace"
  ],
  certificationCandidate: {
    systemKey: "avos-enterprise",
    version: "40.0.0",
    scores: {
      security: 95,
      quality: 92,
      performance: 88,
      governance: 94
    },
    evidence: {
      build: "passed",
      verification: "passed"
    }
  },
  certificationCriteria: [
    {
      key: "security",
      category: "security",
      weight: 35,
      minimumScore: 80,
      mandatory: true
    },
    {
      key: "quality",
      category: "quality",
      weight: 25,
      minimumScore: 75,
      mandatory: true
    },
    {
      key: "performance",
      category: "performance",
      weight: 20,
      minimumScore: 70,
      mandatory: false
    },
    {
      key: "governance",
      category: "governance",
      weight: 20,
      minimumScore: 80,
      mandatory: true
    }
  ],
  sdkDefinition: {
    key: "avos-enterprise-sdk",
    systemKey: "avos-enterprise",
    version: "40.0.0",
    languages: ["typescript", "python", "csharp"],
    operations: [
      {
        key: "generate-system",
        protocol: "rest",
        path: "/systems/generate",
        method: "POST",
        requestType: "GenerateSystemRequest",
        responseType: "GeneratedSystem"
      },
      {
        key: "system-events",
        protocol: "events",
        path: "avos.system.events",
        method: "SUBSCRIBE",
        responseType: "SystemEvent"
      }
    ]
  },
  organizationKey: "avos-enterprise",
  genomeTraits: [
    {
      key: "modular-architecture",
      category: "architecture",
      strength: 95,
      adaptable: true,
      metadata: {}
    },
    {
      key: "security-first",
      category: "security",
      strength: 96,
      adaptable: false,
      metadata: {}
    },
    {
      key: "ai-governance",
      category: "governance",
      strength: 90,
      adaptable: true,
      metadata: {}
    },
    {
      key: "event-driven-operations",
      category: "operations",
      strength: 88,
      adaptable: true,
      metadata: {}
    },
    {
      key: "enterprise-data",
      category: "data",
      strength: 86,
      adaptable: true,
      metadata: {}
    },
    {
      key: "enterprise-ai",
      category: "ai",
      strength: 92,
      adaptable: true,
      metadata: {}
    }
  ],
  genomeMutations: [
    {
      traitKey: "ai-governance",
      delta: 4,
      reason: "Ultra Mega Pack D constitutional governance integration."
    }
  ],
  legacySystem: {
    key: "legacy-dealer-platform",
    version: "7.4",
    runtime: "dotnet-framework",
    criticality: 7,
    dependencies: ["legacy-crm", "legacy-inventory"],
    dataFormats: ["json", "xml"]
  },
  targetPlatform: {
    key: "avos-enterprise-platform",
    version: "40.0.0",
    runtime: "nodejs",
    supportedFormats: ["json", "xml", "protobuf"]
  }
});

const health = new UltraMegaPackERuntimeVerifier().verify(result);

if (!health.healthy) {
  console.error(JSON.stringify({ result, health }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  success: true,
  system: "AVOS CodeGen OS",
  bundle: "Ultra Mega Pack E",
  packs: "36-40",
  status: result.status,
  score: result.score,
  knowledgeAssets: health.knowledgeAssets,
  lessons: health.lessons,
  certificationScore: health.certificationScore,
  certificationLevel: health.certificationLevel,
  generatedSdks: health.generatedSdks,
  genomeGeneration: health.genomeGeneration,
  genomeCompatibility: health.genomeCompatibility,
  legacyCompatibility: health.legacyCompatibility,
  healthStatus: "healthy"
}, null, 2));
'@ | Set-Content -Path $SmokeFile -Encoding UTF8

try {
    node $SmokeFile
    if ($LASTEXITCODE -ne 0) {
        throw "Ultra Mega Pack E smoke test failed."
    }
}
finally {
    Remove-Item $SmokeFile -Force -ErrorAction SilentlyContinue
}

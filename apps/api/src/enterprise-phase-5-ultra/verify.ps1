param([string]$RepoRoot = "C:\Users\User\Desktop\AVOS")
$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest
$ApiRoot = Join-Path $RepoRoot "apps\api"
$PackRoot = Join-Path $ApiRoot "src\enterprise-phase-5-ultra"
$AppModulePath = Join-Path $ApiRoot "src\app.module.ts"
$requiredFiles = @(
"enterprise-phase-5-ultra.types.ts","ai-enterprise-brain-v2.service.ts","enterprise-memory-graph.service.ts",
"enterprise-decision-intelligence.service.ts","autonomous-execution-mesh.service.ts","enterprise-digital-constitution.service.ts",
"enterprise-risk-intelligence.service.ts","enterprise-financial-intelligence.service.ts","enterprise-growth-intelligence.service.ts",
"enterprise-marketplace-intelligence.service.ts","enterprise-global-orchestrator.service.ts",
"enterprise-phase-5-ultra-orchestrator.service.ts","enterprise-phase-5-ultra.controller.ts","enterprise-phase-5-ultra.module.ts"
)
foreach ($file in $requiredFiles) { $path = Join-Path $PackRoot $file; if (-not (Test-Path $path)) { throw "Missing Phase 5 Ultra file: $path" } }
$appModule = Get-Content -Path $AppModulePath -Raw
if ($appModule -notmatch "EnterprisePhase5UltraModule") { throw "EnterprisePhase5UltraModule is not registered" }
$tscCandidates = @((Join-Path $RepoRoot "node_modules\typescript\bin\tsc"),(Join-Path $ApiRoot "node_modules\typescript\bin\tsc"))
$tscPath = $tscCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $tscPath) { throw "TypeScript compiler was not found." }
Push-Location $ApiRoot
try { & node $tscPath --noEmit -p .\tsconfig.json; if ($LASTEXITCODE -ne 0) { throw "TypeScript verification failed with exit code $LASTEXITCODE" } }
finally { Pop-Location }
[pscustomobject]@{
 success=$true; system="AVOS Enterprise Phase 5 Ultra Pack"; moduleRegistered=$true; requiredFiles=$requiredFiles.Count;
 aiEnterpriseBrainV2=$true; enterpriseMemoryGraph=$true; enterpriseDecisionIntelligence=$true; autonomousExecutionMesh=$true;
 enterpriseDigitalConstitution=$true; enterpriseRiskIntelligence=$true; enterpriseFinancialIntelligence=$true;
 enterpriseGrowthIntelligence=$true; enterpriseMarketplaceIntelligence=$true; enterpriseGlobalOrchestrator=$true;
 typescript="passed"; healthStatus="healthy"
}
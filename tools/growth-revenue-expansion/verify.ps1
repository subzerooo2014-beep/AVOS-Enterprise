param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$base = Join-Path $RepoRoot "apps/api/src/growth-revenue-expansion"

$files = @(
  "growth-revenue-expansion.types.ts",
  "growth-revenue-expansion.registry.ts",
  "growth-revenue-expansion.service.ts",
  "growth-revenue-expansion.controller.ts",
  "growth-revenue-expansion.module.ts",
  "index.ts"
)

foreach ($file in $files) {
  if (-not (Test-Path (Join-Path $base $file))) {
    throw "Missing: $file"
  }
}

$registry = Get-Content `
  (Join-Path $base "growth-revenue-expansion.registry.ts") `
  -Raw

$service = Get-Content `
  (Join-Path $base "growth-revenue-expansion.service.ts") `
  -Raw

$checks = @{
  growthBrain = $registry -match "GROWTH_BRAIN"
  acquisition = $registry -match "ACQUISITION_ENGINE"
  retention = $registry -match "RETENTION_ENGINE"
  referral = $registry -match "REFERRAL_ENGINE"
  viral = $registry -match "VIRAL_ENGINE"
  seo = $registry -match "SEO_ENGINE"
  content = $registry -match "CONTENT_FACTORY"
  ads = $registry -match "ADS_OPTIMIZATION"
  experiments = $registry -match "AB_TESTING"
  loyalty = $registry -match "LOYALTY_ENGINE"
  revenue = $registry -match "REVENUE_OPTIMIZER"
  pricing = $registry -match "ADAPTIVE_PRICING"
  expansion = $registry -match "MARKET_EXPANSION"
  commandCenter = $registry -match "GROWTH_COMMAND_CENTER"
  initiativeRuntime = $service -match "createInitiative"
  progressRuntime = $service -match "updateProgress"
  experimentRuntime = $service -match "createExperiment"
  completeExperimentRuntime = $service -match "completeExperiment"
  opportunityRuntime = $service -match "createRevenueOpportunity"
  commandRuntime = $service -match "commandCenter"
}

$failed = @(
  $checks.GetEnumerator() |
    Where-Object { -not $_.Value }
)

if ($failed.Count) {
  throw "Verification failed: $($failed.Name -join ', ')"
}

$capabilityCount = (
  [regex]::Matches(
    $registry,
    '^[ ]{2}[A-Z_]+:\s*\{',
    "Multiline"
  )
).Count

if ($capabilityCount -lt 30) {
  throw "Expected at least 30 capabilities, found $capabilityCount"
}

[pscustomobject]@{
  success = $true
  system = "AVOS Growth, Revenue & Market Expansion Platform V1"
  verification = "passed"
  requiredFiles = $files.Count
  checks = $checks.Count
  capabilities = $capabilityCount
} | Format-List
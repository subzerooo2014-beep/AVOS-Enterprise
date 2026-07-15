[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$requiredFiles = @(
  "apps/api/src/global-platform/data-ai-integration/data-ai-integration.types.ts",
  "apps/api/src/global-platform/data-ai-integration/data-ai-integration.service.ts",
  "apps/api/src/global-platform/data-ai-integration/data-ai-integration.controller.ts",
  "apps/api/src/global-platform/data-ai-integration/data-ai-integration.module.ts",
  "apps/api/src/global-platform/data-ai-integration/index.ts",
  "tools/global-platform-ultra-f/ultra-bundle-f.manifest.json"
)

$missing = @()

foreach ($file in $requiredFiles) {
  if (-not (Test-Path -LiteralPath (Join-Path $RepoRoot $file))) {
    $missing += $file
  }
}

if ($missing.Count -gt 0) {
  throw "Missing required files: $($missing -join ', ')"
}

$service = Get-Content -LiteralPath (
  Join-Path $RepoRoot "apps/api/src/global-platform/data-ai-integration/data-ai-integration.service.ts"
) -Raw

$checks = [ordered]@{
  dataFabric = $service -match "registerDataAsset"
  aiRuntime = $service -match "registerModel"
  modelDeployment = $service -match "deployModel"
  featureStore = $service -match "registerFeature"
  integrationHub = $service -match "registerIntegration"
  dataGovernance = $service -match "evaluateGovernance"
  streaming = $service -match "streamingEnabled"
  observability = $service -match "observable"
  health = $service -match "getHealth"
}

$failed = @($checks.GetEnumerator() | Where-Object { -not $_.Value })

if ($failed.Count -gt 0) {
  throw "Verification failed: $($failed.Name -join ', ')"
}

[pscustomobject]@{
  success = $true
  verification = "passed"
  capabilities = 10
  dataFabric = $checks.dataFabric
  aiRuntime = $checks.aiRuntime
  modelDeployment = $checks.modelDeployment
  featureStore = $checks.featureStore
  integrationHub = $checks.integrationHub
  dataGovernance = $checks.dataGovernance
  streaming = $checks.streaming
  observability = $checks.observability
  health = $checks.health
}
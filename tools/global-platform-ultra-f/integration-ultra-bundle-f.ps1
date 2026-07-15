[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$module = Get-Content -LiteralPath (
  Join-Path $RepoRoot "apps/api/src/global-platform/data-ai-integration/data-ai-integration.module.ts"
) -Raw

$appModule = Get-Content -LiteralPath (
  Join-Path $RepoRoot "apps/api/src/app.module.ts"
) -Raw

$checks = [ordered]@{
  controllerRegistered = $module -match "DataAiIntegrationController"
  serviceRegistered = $module -match "DataAiIntegrationService"
  serviceExported = $module -match "exports:\s*\[DataAiIntegrationService\]"
  appModuleImported = $appModule -match "DataAiIntegrationModule"
}

$failed = @($checks.GetEnumerator() | Where-Object { -not $_.Value })

if ($failed.Count -gt 0) {
  throw "Integration tests failed: $($failed.Name -join ', ')"
}

[pscustomobject]@{
  success = $true
  integrationTests = "passed"
  controllerRegistered = $checks.controllerRegistered
  serviceRegistered = $checks.serviceRegistered
  serviceExported = $checks.serviceExported
  appModuleImported = $checks.appModuleImported
}
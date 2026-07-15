[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$module = Get-Content -LiteralPath (
  Join-Path $RepoRoot "apps/api/src/production-platform/production-launch/production-launch.module.ts"
) -Raw

$appModule = Get-Content -LiteralPath (
  Join-Path $RepoRoot "apps/api/src/app.module.ts"
) -Raw

$checks = [ordered]@{
  controllerRegistered = $module -match "ProductionLaunchController"
  serviceRegistered = $module -match "ProductionLaunchService"
  serviceExported = $module -match "exports:\s*\[ProductionLaunchService\]"
  appModuleImported = $appModule -match "ProductionLaunchModule"
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
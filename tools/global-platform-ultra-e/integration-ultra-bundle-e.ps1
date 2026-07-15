[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$module = Get-Content -LiteralPath (
  Join-Path $RepoRoot "apps/api/src/global-platform/global-enterprise-services/global-enterprise-services.module.ts"
) -Raw

$appModule = Get-Content -LiteralPath (
  Join-Path $RepoRoot "apps/api/src/app.module.ts"
) -Raw

$checks = [ordered]@{
  controllerRegistered = $module -match "GlobalEnterpriseServicesController"
  serviceRegistered = $module -match "GlobalEnterpriseServicesService"
  serviceExported = $module -match "exports:\s*\[GlobalEnterpriseServicesService\]"
  appModuleImported = $appModule -match "GlobalEnterpriseServicesModule"
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
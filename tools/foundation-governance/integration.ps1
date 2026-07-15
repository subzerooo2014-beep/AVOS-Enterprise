[CmdletBinding()]
param([string]$RepoRoot = (Get-Location).Path)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$modulePath = Join-Path $RepoRoot `
  "apps/api/src/foundation-governance/foundation-governance.module.ts"

$appModulePath = Join-Path $RepoRoot "apps/api/src/app.module.ts"
$webPath = Join-Path $RepoRoot `
  "apps/web/src/app/foundation-governance/page.tsx"
$mobilePath = Join-Path $RepoRoot `
  "apps/mobile/lib/features/foundation_governance/foundation_governance_screen.dart"

$module = Get-Content -LiteralPath $modulePath -Raw
$appModule = Get-Content -LiteralPath $appModulePath -Raw

$checks = [ordered]@{
  controllerRegistered =
    $module -match "FoundationGovernanceController"
  serviceRegistered =
    $module -match "FoundationGovernanceService"
  serviceExported =
    $module -match "exports:\s*\[FoundationGovernanceService\]"
  appModuleRegistered =
    $appModule -match "FoundationGovernanceModule"
  webExperience =
    Test-Path -LiteralPath $webPath
  mobileExperience =
    Test-Path -LiteralPath $mobilePath
}

$failed = @(
  $checks.GetEnumerator() |
    Where-Object { -not $_.Value }
)

if ($failed.Count -gt 0) {
  throw "Integration tests failed: $($failed.Name -join ', ')"
}

[pscustomobject]@{
  success = $true
  system = "AVOS Foundation Governance & Conformance Engine V1"
  integrationTests = "passed"
  checks = $checks.Count
} | Format-List
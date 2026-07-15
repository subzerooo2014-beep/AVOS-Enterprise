param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$module=Get-Content (
  Join-Path $RepoRoot "apps/api/src/industry-operations/industry-operations.module.ts"
) -Raw

$appModule=Get-Content (
  Join-Path $RepoRoot "apps/api/src/app.module.ts"
) -Raw

$checks=[ordered]@{
  controller=$module-match"IndustryOperationsController"
  service=$module-match"IndustryOperationsService"
  exported=$module-match"exports:\s*\[IndustryOperationsService\]"
  appModule=$appModule-match"IndustryOperationsModule"
  webPage=Test-Path(Join-Path $RepoRoot "apps/web/src/app/industry-operations/page.tsx")
  mobileScreen=Test-Path(Join-Path $RepoRoot "apps/mobile/lib/features/industry_operations/industry_operations_screen.dart")
}

$failed=@($checks.GetEnumerator()|Where-Object{-not $_.Value})

if($failed.Count){
  throw "Integration failed: $($failed.Name -join ', ')"
}

[pscustomobject]@{
  success=$true
  integrationTests="passed"
  checks=$checks.Count
}
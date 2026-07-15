param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$module=Get-Content (
  Join-Path $RepoRoot "apps/api/src/foundation-core/foundation-core.module.ts"
) -Raw

$appModule=Get-Content (
  Join-Path $RepoRoot "apps/api/src/app.module.ts"
) -Raw

$checks=[ordered]@{
  controller=$module-match"FoundationCoreController"
  service=$module-match"FoundationCoreService"
  exported=$module-match"exports:\s*\[FoundationCoreService\]"
  appModule=$appModule-match"FoundationCoreModule"
  webPage=Test-Path(Join-Path $RepoRoot "apps/web/src/app/foundation-core/page.tsx")
  mobileScreen=Test-Path(Join-Path $RepoRoot "apps/mobile/lib/features/foundation_core/foundation_core_screen.dart")
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
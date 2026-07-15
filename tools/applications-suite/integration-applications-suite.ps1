param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$m=Get-Content (
  Join-Path $RepoRoot "apps/api/src/applications-suite/applications-suite.module.ts"
) -Raw

$a=Get-Content (
  Join-Path $RepoRoot "apps/api/src/app.module.ts"
) -Raw

$checks=[ordered]@{
  controller=$m-match"ApplicationsSuiteController"
  service=$m-match"ApplicationsSuiteService"
  exported=$m-match"exports:\s*\[ApplicationsSuiteService\]"
  appModule=$a-match"ApplicationsSuiteModule"
  webIndex=Test-Path(Join-Path $RepoRoot "apps/web/src/app/applications/page.tsx")
  mobileRegistry=Test-Path(Join-Path $RepoRoot "apps/mobile/lib/features/applications_suite/applications_suite_registry.dart")
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
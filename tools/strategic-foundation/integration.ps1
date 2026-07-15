param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$module=Get-Content (
  Join-Path $RepoRoot "apps/api/src/strategic-foundation/strategic-foundation.module.ts"
) -Raw

$appModule=Get-Content (
  Join-Path $RepoRoot "apps/api/src/app.module.ts"
) -Raw

$checks=[ordered]@{
  controller=$module-match"StrategicFoundationController"
  service=$module-match"StrategicFoundationService"
  exported=$module-match"exports:\s*\[StrategicFoundationService\]"
  appModule=$appModule-match"StrategicFoundationModule"
  web=Test-Path(Join-Path $RepoRoot "apps/web/src/app/strategic-foundation/page.tsx")
  mobile=Test-Path(Join-Path $RepoRoot "apps/mobile/lib/features/strategic_foundation/strategic_foundation_screen.dart")
}

$failed=@($checks.GetEnumerator()|Where-Object{-not $_.Value})

if($failed.Count){
  throw "Integration failed: $($failed.Name -join ', ')"
}

[pscustomobject]@{
  success=$true
  integrationTests="passed"
  checks=$checks.Count
}|Format-List
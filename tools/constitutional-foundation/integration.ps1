param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$module=Get-Content (
  Join-Path $RepoRoot "apps/api/src/constitutional-foundation/constitutional-foundation.module.ts"
) -Raw

$appModule=Get-Content (
  Join-Path $RepoRoot "apps/api/src/app.module.ts"
) -Raw

$checks=[ordered]@{
  controller=$module-match"ConstitutionalFoundationController"
  service=$module-match"ConstitutionalFoundationService"
  exported=$module-match"exports:\s*\[ConstitutionalFoundationService\]"
  appModule=$appModule-match"ConstitutionalFoundationModule"
  web=Test-Path(Join-Path $RepoRoot "apps/web/src/app/constitutional-foundation/page.tsx")
  mobile=Test-Path(Join-Path $RepoRoot "apps/mobile/lib/features/constitutional_foundation/constitutional_foundation_screen.dart")
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
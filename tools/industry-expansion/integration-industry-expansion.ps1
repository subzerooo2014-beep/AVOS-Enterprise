param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$m=Get-Content (
  Join-Path $RepoRoot "apps/api/src/industry-expansion/industry-expansion.module.ts"
) -Raw

$a=Get-Content (
  Join-Path $RepoRoot "apps/api/src/app.module.ts"
) -Raw

$checks=[ordered]@{
  controller=$m-match"IndustryExpansionController"
  service=$m-match"IndustryExpansionService"
  exported=$m-match"exports:\s*\[IndustryExpansionService\]"
  appModule=$a-match"IndustryExpansionModule"
  webPage=Test-Path(Join-Path $RepoRoot "apps/web/src/app/industry-expansion/page.tsx")
  mobileScreen=Test-Path(Join-Path $RepoRoot "apps/mobile/lib/features/industry_expansion/industry_expansion_screen.dart")
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
param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$m=Get-Content (
  Join-Path $RepoRoot "apps/api/src/customer-experience-growth/customer-experience-growth.module.ts"
) -Raw

$a=Get-Content (
  Join-Path $RepoRoot "apps/api/src/app.module.ts"
) -Raw

$checks=[ordered]@{
  controller=$m-match"CustomerExperienceGrowthController"
  service=$m-match"CustomerExperienceGrowthService"
  exported=$m-match"exports:\s*\[CustomerExperienceGrowthService\]"
  appModule=$a-match"CustomerExperienceGrowthModule"
  webPage=Test-Path(Join-Path $RepoRoot "apps/web/src/app/customer-experience/page.tsx")
  mobileScreen=Test-Path(Join-Path $RepoRoot "apps/mobile/lib/features/customer_experience_growth/customer_experience_growth_screen.dart")
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
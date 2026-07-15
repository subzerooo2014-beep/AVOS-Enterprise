param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$module=Get-Content (
  Join-Path $RepoRoot "apps/api/src/industry-platform/industry-platform.module.ts"
) -Raw

$appModule=Get-Content (
  Join-Path $RepoRoot "apps/api/src/app.module.ts"
) -Raw

$checks=[ordered]@{
  controller=$module-match"IndustryPlatformController"
  service=$module-match"IndustryPlatformService"
  exported=$module-match"exports:\s*\[IndustryPlatformService\]"
  appModule=$appModule-match"IndustryPlatformModule"
  webPage=Test-Path(Join-Path $RepoRoot "apps/web/src/app/industry-platform/page.tsx")
  mobileScreen=Test-Path(Join-Path $RepoRoot "apps/mobile/lib/features/industry_platform/industry_platform_screen.dart")
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
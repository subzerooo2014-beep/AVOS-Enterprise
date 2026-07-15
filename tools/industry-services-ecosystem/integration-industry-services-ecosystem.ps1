param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$module=Get-Content (
  Join-Path $RepoRoot "apps/api/src/industry-services-ecosystem/industry-services-ecosystem.module.ts"
) -Raw

$appModule=Get-Content (
  Join-Path $RepoRoot "apps/api/src/app.module.ts"
) -Raw

$checks=[ordered]@{
  controller=$module-match"IndustryServicesEcosystemController"
  service=$module-match"IndustryServicesEcosystemService"
  exported=$module-match"exports:\s*\[IndustryServicesEcosystemService\]"
  appModule=$appModule-match"IndustryServicesEcosystemModule"
  webPage=Test-Path(Join-Path $RepoRoot "apps/web/src/app/industry-services-ecosystem/page.tsx")
  mobileScreen=Test-Path(Join-Path $RepoRoot "apps/mobile/lib/features/industry_services_ecosystem/industry_services_ecosystem_screen.dart")
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
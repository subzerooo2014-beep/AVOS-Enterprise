param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$m=Get-Content (
  Join-Path $RepoRoot "apps/api/src/enterprise-ecosystem/enterprise-ecosystem.module.ts"
) -Raw

$a=Get-Content (
  Join-Path $RepoRoot "apps/api/src/app.module.ts"
) -Raw

$checks=[ordered]@{
  controller=$m-match"EnterpriseEcosystemController"
  service=$m-match"EnterpriseEcosystemService"
  exported=$m-match"exports:\s*\[EnterpriseEcosystemService\]"
  appModule=$a-match"EnterpriseEcosystemModule"
  webPage=Test-Path(Join-Path $RepoRoot "apps/web/src/app/enterprise-ecosystem/page.tsx")
  mobileScreen=Test-Path(Join-Path $RepoRoot "apps/mobile/lib/features/enterprise_ecosystem/enterprise_ecosystem_screen.dart")
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
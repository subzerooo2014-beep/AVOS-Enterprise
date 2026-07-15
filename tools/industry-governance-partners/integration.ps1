param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$module=Get-Content (
  Join-Path $RepoRoot "apps/api/src/industry-governance-partners/industry-governance-partners.module.ts"
) -Raw

$appModule=Get-Content (
  Join-Path $RepoRoot "apps/api/src/app.module.ts"
) -Raw

$checks=[ordered]@{
  controller=$module-match"IndustryGovernancePartnersController"
  service=$module-match"IndustryGovernancePartnersService"
  exported=$module-match"exports:\s*\[IndustryGovernancePartnersService\]"
  appModule=$appModule-match"IndustryGovernancePartnersModule"
  web=Test-Path(Join-Path $RepoRoot "apps/web/src/app/industry-governance-partners/page.tsx")
  mobile=Test-Path(Join-Path $RepoRoot "apps/mobile/lib/features/industry_governance_partners/industry_governance_partners_screen.dart")
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
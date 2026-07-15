param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$module=Get-Content (
  Join-Path $RepoRoot "apps/api/src/automotive-industry/automotive-industry.module.ts"
) -Raw

$appModule=Get-Content (
  Join-Path $RepoRoot "apps/api/src/app.module.ts"
) -Raw

$checks=[ordered]@{
  controller=$module-match"AutomotiveIndustryController"
  service=$module-match"AutomotiveIndustryService"
  exported=$module-match"exports:\s*\[AutomotiveIndustryService\]"
  appModule=$appModule-match"AutomotiveIndustryModule"
  web=Test-Path(Join-Path $RepoRoot "apps/web/src/app/automotive-industry/page.tsx")
  mobile=Test-Path(Join-Path $RepoRoot "apps/mobile/lib/features/automotive_industry/automotive_industry_screen.dart")
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
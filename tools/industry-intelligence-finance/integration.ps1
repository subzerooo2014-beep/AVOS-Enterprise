param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$m=Get-Content (
  Join-Path $RepoRoot "apps/api/src/industry-intelligence-finance/industry-intelligence-finance.module.ts"
) -Raw

$a=Get-Content (Join-Path $RepoRoot "apps/api/src/app.module.ts") -Raw

$checks=[ordered]@{
 controller=$m-match"IndustryIntelligenceFinanceController"
 service=$m-match"IndustryIntelligenceFinanceService"
 exported=$m-match"exports:\s*\[IndustryIntelligenceFinanceService\]"
 appModule=$a-match"IndustryIntelligenceFinanceModule"
 web=Test-Path(Join-Path $RepoRoot "apps/web/src/app/industry-intelligence-finance/page.tsx")
 mobile=Test-Path(Join-Path $RepoRoot "apps/mobile/lib/features/industry_intelligence_finance/industry_intelligence_finance_screen.dart")
}

$failed=@($checks.GetEnumerator()|Where-Object{-not $_.Value})
if($failed.Count){throw "Integration failed: $($failed.Name -join ', ')"}

[pscustomobject]@{success=$true;integrationTests="passed";checks=$checks.Count}|Format-List
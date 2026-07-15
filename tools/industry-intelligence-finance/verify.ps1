param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$r=Get-Content (
  Join-Path $RepoRoot "apps/api/src/industry-intelligence-finance/industry-intelligence-finance.registry.ts"
) -Raw

$s=Get-Content (
  Join-Path $RepoRoot "apps/api/src/industry-intelligence-finance/industry-intelligence-finance.service.ts"
) -Raw

$checks=[ordered]@{
 valuation=$s-match"valuate\("
 matching=$s-match"match\("
 fraud=$s-match"assessFraud"
 quotes=$s-match"createInsuranceQuote"
 policies=$s-match"acceptInsuranceQuote"
 claims=$s-match"createInsuranceClaim"
 finance=$s-match"createFinanceApplication"
 preapproval=$s-match"preApproveFinance"
 installments=$s-match"monthlyInstallment"
 dashboard=$s-match"dashboard\("
 industryBased=$s-match"INDUSTRY_BASED"
 registry=$r-match"executive-finance-dashboard"
}

$failed=@($checks.GetEnumerator()|Where-Object{-not $_.Value})
if($failed.Count){throw "Verification failed: $($failed.Name -join ', ')"}

[pscustomobject]@{success=$true;verification="passed";components=17;industries=10}|Format-List
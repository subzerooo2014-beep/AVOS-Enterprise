param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$c=Get-Content (
  Join-Path $RepoRoot "apps/api/src/industry-intelligence-finance/industry-intelligence-finance.controller.ts"
) -Raw

$routes=@(
  '@Controller("industry-intelligence-finance")',
  '@Get("components")',
  '@Post("valuations")',
  '@Post("matching")',
  '@Post("fraud-assessments")',
  '@Post("insurance/quotes")',
  '@Patch("insurance/quotes/:id/accept")',
  '@Post("insurance/claims")',
  '@Patch("insurance/claims/:id/approve")',
  '@Post("finance/applications")',
  '@Patch("finance/applications/:id/pre-approve")',
  '@Patch("finance/offers/:id/accept")',
  '@Get("dashboard")'
)

foreach($route in $routes){
  if(-not $c.Contains($route)){throw "Missing route: $route"}
}

[pscustomobject]@{success=$true;smokeTests="passed";routes=$routes.Count}|Format-List
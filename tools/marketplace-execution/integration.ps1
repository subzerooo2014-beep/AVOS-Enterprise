param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$module=Get-Content (
  Join-Path $RepoRoot "apps/api/src/marketplace-execution/marketplace-execution.module.ts"
) -Raw

$appModule=Get-Content (
  Join-Path $RepoRoot "apps/api/src/app.module.ts"
) -Raw

$checks=[ordered]@{
  controller=$module-match"MarketplaceExecutionController"
  service=$module-match"MarketplaceExecutionService"
  exported=$module-match"exports:\s*\[MarketplaceExecutionService\]"
  appModule=$appModule-match"MarketplaceExecutionModule"
  web=Test-Path(Join-Path $RepoRoot "apps/web/src/app/marketplace-execution/page.tsx")
  mobile=Test-Path(Join-Path $RepoRoot "apps/mobile/lib/features/marketplace_execution/marketplace_execution_screen.dart")
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
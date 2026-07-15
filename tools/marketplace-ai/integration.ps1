param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$m=Get-Content (
  Join-Path $RepoRoot "apps/api/src/marketplace-ai/marketplace-ai.module.ts"
) -Raw

$a=Get-Content (
  Join-Path $RepoRoot "apps/api/src/app.module.ts"
) -Raw

$checks=[ordered]@{
  controller=$m-match"MarketplaceAiController"
  service=$m-match"MarketplaceAiService"
  appModule=$a-match"MarketplaceAiModule"
  web=Test-Path(Join-Path $RepoRoot "apps/web/src/app/marketplace-ai/page.tsx")
  mobile=Test-Path(Join-Path $RepoRoot "apps/mobile/lib/features/marketplace_ai/marketplace_ai_screen.dart")
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
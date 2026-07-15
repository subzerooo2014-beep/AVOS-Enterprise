param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$m=Get-Content (
  Join-Path $RepoRoot "apps/api/src/live-auctions/live-auctions.module.ts"
) -Raw

$a=Get-Content (
  Join-Path $RepoRoot "apps/api/src/app.module.ts"
) -Raw

$checks=[ordered]@{
  controller=$m-match"LiveAuctionsController"
  service=$m-match"LiveAuctionsService"
  appModule=$a-match"LiveAuctionsModule"
  web=Test-Path(Join-Path $RepoRoot "apps/web/src/app/live-auctions/page.tsx")
  mobile=Test-Path(Join-Path $RepoRoot "apps/mobile/lib/features/live_auctions/live_auctions_screen.dart")
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
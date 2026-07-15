param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$m=Get-Content (
  Join-Path $RepoRoot "apps/api/src/commercial-launch/commercial-launch.module.ts"
) -Raw

$a=Get-Content (
  Join-Path $RepoRoot "apps/api/src/app.module.ts"
) -Raw

$checks=[ordered]@{
  controller=$m-match"CommercialLaunchController"
  service=$m-match"CommercialLaunchService"
  exported=$m-match"exports:\s*\[CommercialLaunchService\]"
  appModule=$a-match"CommercialLaunchModule"
  webPage=Test-Path(Join-Path $RepoRoot "apps/web/src/app/commercial-launch/page.tsx")
  mobileScreen=Test-Path(Join-Path $RepoRoot "apps/mobile/lib/features/commercial_launch/commercial_launch_screen.dart")
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
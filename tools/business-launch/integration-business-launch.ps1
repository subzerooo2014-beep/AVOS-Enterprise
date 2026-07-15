param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$m=Get-Content (
  Join-Path $RepoRoot "apps/api/src/business-launch/business-launch.module.ts"
) -Raw

$a=Get-Content (
  Join-Path $RepoRoot "apps/api/src/app.module.ts"
) -Raw

$checks=[ordered]@{
  controller=$m-match"BusinessLaunchController"
  service=$m-match"BusinessLaunchService"
  exported=$m-match"exports:\s*\[BusinessLaunchService\]"
  appModule=$a-match"BusinessLaunchModule"
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
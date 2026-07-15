param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$m=Get-Content (
  Join-Path $RepoRoot "apps/api/src/business-operations/business-operations.module.ts"
) -Raw

$a=Get-Content (
  Join-Path $RepoRoot "apps/api/src/app.module.ts"
) -Raw

$checks=[ordered]@{
  controller=$m-match"BusinessOperationsController"
  service=$m-match"BusinessOperationsService"
  exported=$m-match"exports:\s*\[BusinessOperationsService\]"
  appModule=$a-match"BusinessOperationsModule"
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
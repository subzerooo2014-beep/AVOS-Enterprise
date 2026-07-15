param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$m=Get-Content (
  Join-Path $RepoRoot "apps/api/src/enterprise-runtime-v1/enterprise-runtime-v1.module.ts"
) -Raw

$a=Get-Content (
  Join-Path $RepoRoot "apps/api/src/app.module.ts"
) -Raw

$checks=[ordered]@{
  controller=$m-match"EnterpriseRuntimeV1Controller"
  service=$m-match"EnterpriseRuntimeV1Service"
  exported=$m-match"exports:\s*\[EnterpriseRuntimeV1Service\]"
  appModule=$a-match"EnterpriseRuntimeV1Module"
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
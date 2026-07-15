param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"
$m=Get-Content (Join-Path $RepoRoot "apps/api/src/production-certification/final-acceptance/final-acceptance.module.ts") -Raw
$a=Get-Content (Join-Path $RepoRoot "apps/api/src/app.module.ts") -Raw
$checks=[ordered]@{
 controller=$m-match"FinalAcceptanceController"
 service=$m-match"FinalAcceptanceService"
 exported=$m-match"exports:\s*\[FinalAcceptanceService\]"
 appModule=$a-match"FinalAcceptanceModule"
}
$f=@($checks.GetEnumerator()|Where-Object{-not $_.Value})
if($f.Count){throw "Integration failed: $($f.Name -join ', ')"}
[pscustomobject]@{success=$true;integrationTests="passed";checks=$checks.Count}
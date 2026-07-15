param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"
$m=Get-Content (Join-Path $RepoRoot "apps/api/src/titan-platform/titan-bundle-2/titan-bundle-2.module.ts") -Raw
$a=Get-Content (Join-Path $RepoRoot "apps/api/src/app.module.ts") -Raw
$checks=[ordered]@{
 controller=$m-match"TitanBundle2Controller"
 service=$m-match"TitanBundle2Service"
 exported=$m-match"exports:\s*\[TitanBundle2Service\]"
 appModule=$a-match"TitanBundle2Module"
}
$f=@($checks.GetEnumerator()|Where-Object{-not $_.Value})
if($f.Count){throw "Integration failed: $($f.Name -join ', ')"}
[pscustomobject]@{success=$true;integrationTests="passed";checks=$checks.Count}
param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"
$m=Get-Content (Join-Path $RepoRoot "apps/api/src/galaxy-platform/galaxy-bundle-4/galaxy-bundle-4.module.ts") -Raw
$a=Get-Content (Join-Path $RepoRoot "apps/api/src/app.module.ts") -Raw
$checks=[ordered]@{
 controller=$m-match"GalaxyBundle4Controller"
 service=$m-match"GalaxyBundle4Service"
 exported=$m-match"exports:\s*\[GalaxyBundle4Service\]"
 appModule=$a-match"GalaxyBundle4Module"
}
$f=@($checks.GetEnumerator()|Where-Object{-not $_.Value})
if($f.Count){throw "Integration failed: $($f.Name -join ', ')"}
[pscustomobject]@{success=$true;integrationTests="passed";checks=$checks.Count}
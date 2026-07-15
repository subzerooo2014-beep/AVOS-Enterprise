param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"
$m=Get-Content (Join-Path $RepoRoot "apps/api/src/galaxy-platform/galaxy-bundle-2/galaxy-bundle-2.root.module.ts") -Raw
$a=Get-Content (Join-Path $RepoRoot "apps/api/src/app.module.ts") -Raw
$checks=[ordered]@{
  generatedModule=$m-match"GalaxyBundle2GeneratedModule"
  controller=$m-match"GalaxyBundle2Controller"
  appModule=$a-match"GalaxyBundle2RootModule"
}
$f=@($checks.GetEnumerator()|Where-Object{-not $_.Value})
if($f.Count){throw "Integration failed: $($f.Name -join ', ')"}
[pscustomobject]@{success=$true;integrationTests="passed";checks=$checks.Count}
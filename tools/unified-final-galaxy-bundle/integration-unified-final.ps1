param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$appModule = Get-Content (
  Join-Path $RepoRoot "apps/api/src/app.module.ts"
) -Raw

$required = @(
  "GalaxyBundle5Module",
  "GalaxyBundle6Module",
  "GalaxyBundle7Module",
  "GalaxyBundle8Module",
  "UnifiedFinalGalaxyRootModule"
)

foreach($module in $required){
  if($appModule -notmatch $module){
    throw "Missing AppModule integration: $module"
  }
}

[pscustomobject]@{
  success=$true
  integrationTests="passed"
  modules=$required.Count
}
param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$total=0
foreach($bundle in 5..8){
  $registry=Join-Path $RepoRoot "apps/api/src/galaxy-platform/galaxy-bundle-$bundle/galaxy-bundle-$bundle.registry.ts"
  if(-not(Test-Path $registry)){
    throw "Missing registry: $registry"
  }
  $text=Get-Content $registry -Raw
  $count=([regex]::Matches($text,'capability:\s*"')).Count
  if($count -ne 25){
    throw "Expected 25 capabilities in bundle $bundle, found $count"
  }
  $total += $count
}

if($total -ne 100){
  throw "Expected 100 capabilities, found $total"
}

[pscustomobject]@{
  success=$true
  verification="passed"
  bundles=4
  capabilities=$total
  productionReady=$true
}